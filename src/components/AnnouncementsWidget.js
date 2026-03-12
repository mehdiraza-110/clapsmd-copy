'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Bell, ChevronRight, Loader2, Megaphone, X } from 'lucide-react';
import { getAnnouncementById, getAnnouncements } from '@/lib/authClient';

const READ_STORAGE_KEY = 'clapsmd-read-announcements';
const POLL_INTERVAL_MS = 60_000;

function formatDateTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function getPrimaryTimestamp(item) {
  return item?.publish_time || item?.scheduled_time || item?.created_at || '';
}

function sortAnnouncements(items) {
  return [...items].sort((left, right) => {
    const leftTime = new Date(getPrimaryTimestamp(left)).getTime() || 0;
    const rightTime = new Date(getPrimaryTimestamp(right)).getTime() || 0;
    return rightTime - leftTime;
  });
}

function normalizeAnnouncements(items, existingItems = []) {
  return sortAnnouncements(items).map((item) => {
    const previous = existingItems.find((existingItem) => String(existingItem.id) === String(item.id));
    return {
      ...item,
      detailLoaded: previous?.detailLoaded || false,
    };
  });
}

function loadReadIds() {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(READ_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch (_error) {
    return [];
  }
}

function persistReadIds(ids) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(ids));
}

export default function AnnouncementsWidget() {
  const pathname = usePathname();
  const [panelOpen, setPanelOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [readIds, setReadIds] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetailId, setLoadingDetailId] = useState(null);
  const [listError, setListError] = useState('');

  const isAdminRoute = pathname?.startsWith('/admin');

  useEffect(() => {
    setReadIds(loadReadIds());
  }, []);

  useEffect(() => {
    if (isAdminRoute) return undefined;

    let cancelled = false;

    const loadAnnouncementsList = async () => {
      try {
        if (!cancelled) {
          setListError('');
        }

        const response = await getAnnouncements();
        if (cancelled) return;

        const now = Date.now();
        const items = Array.isArray(response?.announcements) ? response.announcements : [];
        const publishedOnly = items.filter((item) => {
          const status = String(item?.status || '').toLowerCase();
          const timestamp = getPrimaryTimestamp(item);
          const publishMs = timestamp ? new Date(timestamp).getTime() : 0;

          if (status && status !== 'published') return false;
          if (publishMs && publishMs > now) return false;
          return true;
        });

        setAnnouncements((current) => {
          const normalized = normalizeAnnouncements(publishedOnly, current);
          if (!activeId && normalized[0]?.id != null) {
            setActiveId(String(normalized[0].id));
          }
          return normalized;
        });
      } catch (requestError) {
        if (cancelled) return;
        setListError(requestError?.message || 'Failed to load announcements');
      } finally {
        if (!cancelled) {
          setLoadingList(false);
        }
      }
    };

    loadAnnouncementsList();
    const intervalId = window.setInterval(loadAnnouncementsList, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [isAdminRoute]);

  useEffect(() => {
    if (!panelOpen) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [panelOpen]);

  if (isAdminRoute) {
    return null;
  }

  const unreadIds = announcements
    .map((item) => String(item.id))
    .filter((id) => !readIds.includes(id));

  const unreadCount = unreadIds.length;
  const activeAnnouncement =
    announcements.find((item) => String(item.id) === String(activeId)) || announcements[0] || null;

  const handleSelectAnnouncement = async (announcement) => {
    const selectedId = String(announcement.id);
    setActiveId(selectedId);

    if (announcement?.detailLoaded) {
      if (!readIds.includes(selectedId)) {
        const nextReadIds = [...new Set([...readIds, selectedId])];
        setReadIds(nextReadIds);
        persistReadIds(nextReadIds);
      }
      return;
    }

    try {
      setLoadingDetailId(selectedId);
      const response = await getAnnouncementById(undefined, announcement.id);
      const detailedAnnouncement = response?.announcement;

      if (detailedAnnouncement) {
        setAnnouncements((current) =>
          current.map((item) =>
            String(item.id) === selectedId
              ? { ...item, ...detailedAnnouncement, detailLoaded: true }
              : item,
          ),
        );
      }

      if (!readIds.includes(selectedId)) {
        const nextReadIds = [...new Set([...readIds, selectedId])];
        setReadIds(nextReadIds);
        persistReadIds(nextReadIds);
      }
    } catch (_error) {
      if (!readIds.includes(selectedId)) {
        const nextReadIds = [...new Set([...readIds, selectedId])];
        setReadIds(nextReadIds);
        persistReadIds(nextReadIds);
      }
    } finally {
      setLoadingDetailId(null);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setPanelOpen(true)}
        aria-label="Open announcements"
        className="fixed bottom-5 right-5 z-[70] flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-white shadow-[0_18px_45px_rgba(0,61,91,0.32)] transition-transform hover:-translate-y-1"
      >
        <Bell className="h-7 w-7" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex min-h-6 min-w-6 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-black text-secondary">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        ) : null}
      </button>

      {panelOpen ? (
        <div className="fixed inset-0 z-[80]">
          <button
            type="button"
            aria-label="Close announcements panel"
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
            onClick={() => setPanelOpen(false)}
          />

          <aside className="absolute bottom-0 right-0 top-0 flex w-full max-w-2xl flex-col overflow-hidden bg-white shadow-2xl">
            <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#003d5b_0%,#0c587d_100%)] px-6 py-5 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary">Announcements</p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight">Practice updates and notices</h2>
                  <p className="mt-2 max-w-xl text-sm text-white/75">
                    The newest announcements appear first. Unread items stay highlighted until you open them.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPanelOpen(false)}
                  className="rounded-full border border-white/15 p-2 text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Close announcements panel"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[0.95fr,1.2fr]">
              <div className="border-b border-slate-200 md:border-b-0 md:border-r md:border-slate-200">
                <div className="flex items-center justify-between px-5 py-4">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-secondary">All announcements</p>
                  {unreadCount > 0 ? (
                    <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-secondary">
                      {unreadCount} unread
                    </span>
                  ) : null}
                </div>

                <div className="max-h-[42vh] overflow-y-auto md:max-h-none md:h-full">
                  {loadingList ? (
                    <div className="flex items-center gap-3 px-5 py-8 text-sm text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading announcements...
                    </div>
                  ) : null}

                  {!loadingList && listError ? (
                    <div className="px-5 py-8">
                      <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-4 text-sm text-red-700">
                        {listError}
                      </div>
                    </div>
                  ) : null}

                  {!loadingList && !listError && announcements.length === 0 ? (
                    <div className="px-5 py-8 text-sm text-gray-500">
                      No announcements have been published yet.
                    </div>
                  ) : null}

                  {!loadingList && !listError ? (
                    <div className="space-y-3 px-4 pb-4">
                      {announcements.map((announcement) => {
                        const itemId = String(announcement.id);
                        const isUnread = !readIds.includes(itemId);
                        const isActive = String(activeAnnouncement?.id) === itemId;

                        return (
                          <button
                            key={itemId}
                            type="button"
                            onClick={() => handleSelectAnnouncement(announcement)}
                            className={`w-full rounded-2xl border p-4 text-left transition-all ${
                              isUnread
                                ? 'border-primary/35 bg-primary/10 shadow-[0_10px_30px_rgba(148,209,44,0.10)]'
                                : 'border-slate-200 bg-white'
                            } ${isActive ? 'ring-2 ring-secondary/20' : 'hover:border-slate-300 hover:bg-slate-50'}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  {isUnread ? (
                                    <span className="inline-flex rounded-full bg-primary px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.16em] text-secondary">
                                      New
                                    </span>
                                  ) : null}
                                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                                    {formatDateTime(getPrimaryTimestamp(announcement))}
                                  </p>
                                </div>
                                <p className="mt-2 text-base font-bold text-secondary">
                                  {announcement.title || 'Untitled announcement'}
                                </p>
                              </div>
                              <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-gray-400" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="min-h-0 overflow-y-auto bg-slate-50/80 px-6 py-6">
                {activeAnnouncement ? (
                  <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-secondary">
                        {loadingDetailId === String(activeAnnouncement.id) ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Megaphone className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                          {formatDateTime(getPrimaryTimestamp(activeAnnouncement))}
                        </p>
                        <h3 className="text-xl font-black tracking-tight text-secondary">
                          {activeAnnouncement.title || 'Announcement'}
                        </h3>
                      </div>
                    </div>

                    <div className="mt-6 rounded-2xl bg-slate-50 px-5 py-5">
                      <p className="whitespace-pre-line text-base leading-8 text-gray-700">
                        {activeAnnouncement.message || 'Select an announcement to view the full details.'}
                      </p>
                    </div>
                  </article>
                ) : (
                  <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 px-6 py-10 text-center text-gray-500">
                    Select an announcement to view details.
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
