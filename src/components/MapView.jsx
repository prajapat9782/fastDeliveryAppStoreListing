import { useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import {
  MapContainer,
  TileLayer,
  Circle,
  Marker,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import { CLIENT_COLORS, CLIENT_EMOJI, CLIENT_ICON_URL } from '../constants/clients'

function MapResize() {
  const map = useMap()
  useEffect(() => {
    const c = map.getContainer()
    const ro = new ResizeObserver(() => map.invalidateSize())
    ro.observe(c)
    map.invalidateSize()
    return () => ro.disconnect()
  }, [map])
  return null
}

function FitBounds({ stores }) {
  const map = useMap()
  useEffect(() => {
    if (stores.length === 0) return
    const bounds = L.latLngBounds(stores.map((s) => [s.lat, s.lng]))
    map.fitBounds(bounds, { padding: [56, 56], maxZoom: 13 })
  }, [stores, map])
  return null
}

function FlyToSelection({ point }) {
  const map = useMap()
  useEffect(() => {
    if (!point) return
    map.flyTo([point.lat, point.lng], 15, { duration: 0.85 })
  }, [point, map])
  return null
}

/** Zoom + locate — portaled into map container so it sits above tiles */
function MapToolbar() {
  const map = useMap()
  const el = map.getContainer()
  return createPortal(
    <div className="pointer-events-auto absolute bottom-6 left-6 z-[1000] flex flex-col gap-2">
      <button
        type="button"
        className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-lg font-semibold text-slate-700 shadow-float transition hover:bg-slate-50"
        onClick={() => map.zoomIn()}
        aria-label="Zoom in"
      >
        +
      </button>
      <button
        type="button"
        className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-lg font-semibold text-slate-700 shadow-float transition hover:bg-slate-50"
        onClick={() => map.zoomOut()}
        aria-label="Zoom out"
      >
        −
      </button>
      <button
        type="button"
        className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-600 shadow-float transition hover:bg-slate-50"
        onClick={() => {
          if (!navigator.geolocation) return
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              map.flyTo([pos.coords.latitude, pos.coords.longitude], 14)
            },
            () => { },
            { enableHighAccuracy: true, timeout: 8000 }
          )
        }}
        aria-label="Locate me"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </div>,
    el
  )
}

function StoreMarker({ store, selected, onClick }) {
  const icon = useMemo(() => {
    const color = CLIENT_COLORS[store.client] ?? '#64748b'
    const url = CLIENT_ICON_URL[store.client] ?? ''
    const emoji = CLIENT_EMOJI[store.client] ?? '📍'
    const req = Math.max(0, Math.round(Number(store.totalRaiderReq ?? 0) || 0))
    const safeUrl = url.replace(/"/g, '&quot;')

    const SELECT_RING = '#6D28D9'
    const selectedGlow = selected
      ? `box-shadow:0 0 0 4px ${SELECT_RING},0 0 0 8px rgba(109,40,217,0.25),0 14px 32px rgba(109,40,217,0.45);`
      : 'box-shadow:none;'

    // Old/simple marker (no required-rider badge)
    if (!req) {
      const size = selected ? 54 : 40
      const border = selected ? 5 : 3
      const innerOld = url
        ? `<img src="${safeUrl}" alt="" draggable="false" width="${size}" height="${size}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block;" onerror="this.style.display='none'" />`
        : `<span style="font-size:${selected ? 22 : 17}px;line-height:1;">${emoji}</span>`

      return L.divIcon({
        className: 'marker-pin-wrap',
        html: `<div style="width:${size}px;height:${size}px;border-radius:50%;border:${border}px solid #ffffff;background:${color};display:flex;align-items:center;justify-content:center;overflow:visible;${selectedGlow}">${innerOld}</div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      })
    }

    // New pin marker (shows required-rider badge)
    const width = selected ? 62 : 50
    const height = selected ? 82 : 64
    const innerSize = selected ? 38 : 30
    const inner = url
      ? `<img src="${safeUrl}" alt="" draggable="false" width="${innerSize}" height="${innerSize}" style="width:${innerSize}px;height:${innerSize}px;object-fit:cover;border-radius:12px;display:block;" onerror="this.style.display='none'" />`
      : `<span style="font-size:${selected ? 20 : 16}px;line-height:1;">${emoji}</span>`
    const badge = `<div style="position:absolute;right:-2px;top:-4px;min-width:26px;height:26px;padding:0 8px;border-radius:999px;background:#F59E0B;border:2px solid rgba(255,255,255,0.9);display:flex;align-items:center;justify-content:center;font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;font-weight:900;font-size:13px;color:#ffffff;box-shadow:0 10px 24px rgba(15,23,42,0.18);">${req}</div>`

    // Pin-like background (dark) with subtle stroke
    const pinSvg = `
      <svg width="${width}" height="${height}" viewBox="0 0 64 80" xmlns="http://www.w3.org/2000/svg" style="display:block">
        <path d="M32 78c-7.5-12.8-21-28.7-21-42.5C11 20.4 20.4 11 32 11s21 9.4 21 24.5C53 49.3 39.5 65.2 32 78z" fill="#1F2A44"/>
        <path d="M32 78c-7.5-12.8-21-28.7-21-42.5C11 20.4 20.4 11 32 11s21 9.4 21 24.5C53 49.3 39.5 65.2 32 78z" fill="none" stroke="rgba(255,255,255,0.16)" stroke-width="2"/>
        <circle cx="32" cy="35" r="18" fill="#0F172A" opacity="0.65"/>
        <circle cx="32" cy="35" r="18" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="2"/>
      </svg>
    `

    const pinShellStyle = selected
      ? `filter:drop-shadow(0 0 6px ${SELECT_RING}) drop-shadow(0 10px 24px rgba(109,40,217,0.5));`
      : ''

    return L.divIcon({
      className: 'marker-pin-wrap',
      html: `
        <div style="position:relative;width:${width}px;height:${height}px;${pinShellStyle}">
          ${pinSvg}
          <div style="position:absolute;left:50%;top:35px;transform:translate(-50%,-50%);width:${innerSize}px;height:${innerSize}px;border-radius:14px;background:${color};display:flex;align-items:center;justify-content:center;overflow:hidden;box-shadow:${selected ? `0 0 0 3px ${SELECT_RING},0 12px 26px rgba(109,40,217,0.35)` : '0 10px 22px rgba(15,23,42,0.22)'};border:2px solid rgba(255,255,255,0.95);">
            ${inner}
          </div>
          ${badge}
        </div>
      `,
      iconSize: [width, height],
      iconAnchor: [width / 2, height],
    })
  }, [store.client, store.id, selected])

  return (
    <Marker
      position={[store.lat, store.lng]}
      icon={icon}
      zIndexOffset={selected ? 800 : 0}
      eventHandlers={{
        click: () => onClick(store),
      }}
    />
  )
}

export default function MapView({
  stores,
  flyToPoint,
  selectedStore,
  distanceKm,
  onMarkerClick,
  useFitBounds,
}) {
  const defaultCenter = [28.6139, 77.209]

  return (
    <MapContainer
      center={defaultCenter}
      zoom={10}
      className="map-tiles-grayscale z-0 h-full min-h-[320px] w-full"
      scrollWheelZoom
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <MapResize />
      <MapToolbar />
      {useFitBounds ? <FitBounds stores={stores} /> : <FlyToSelection point={flyToPoint} />}

      {selectedStore && (
        <Circle
          center={[selectedStore.lat, selectedStore.lng]}
          radius={distanceKm * 1000}
          pathOptions={{
            color: '#6D28D9',
            fillColor: '#6D28D9',
            fillOpacity: 0.1,
            weight: 2,
          }}
          interactive={false}
        />
      )}

      {stores.map((s) => (
        <StoreMarker
          key={s.id}
          store={s}
          selected={selectedStore?.id === s.id}
          onClick={onMarkerClick}
        />
      ))}
    </MapContainer>
  )
}
