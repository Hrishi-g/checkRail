import React, { useState } from 'react'
import type { LiveStatusResponse } from '../../types'
import { CloseIcon, CopyIcon, CheckIcon, WhatsAppIcon, ShareIcon } from '../common/Icons'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  liveData: LiveStatusResponse
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, liveData }) => {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const shareUrl = `${window.location.origin}/?train=${liveData.trainNumber}`
  const delayInfo =
    liveData.runningStatus.delayMinutes > 0
      ? `running ${liveData.runningStatus.delayMinutes} min late`
      : 'running on time'

  const shareText = `🚂 Track ${liveData.trainName} (#${liveData.trainNumber}) live on checkRail — currently near ${liveData.currentPosition.nearestStation}, ${delayInfo}!\n\n${shareUrl}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  const handleWhatsAppShare = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`
    window.open(waUrl, '_blank')
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Track ${liveData.trainName} live on checkRail`,
          text: shareText,
          url: shareUrl,
        })
      } catch {
        // cancelled by user
      }
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--color-overlay)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
        animation: 'fadeSlideUp 0.2s var(--ease-spring)',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-lg)',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '19px', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
              Share Live Journey
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '3px' }}>
              Anyone with this link can track this train in real-time.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close share dialog"
            style={{
              padding: '6px',
              borderRadius: '50%',
              color: 'var(--color-text-secondary)',
              display: 'flex',
            }}
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Train Summary Banner */}
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-base)',
            padding: '14px',
            border: '1px solid var(--color-border)',
          }}
        >
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            {liveData.trainName} ({liveData.trainNumber})
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Near {liveData.currentPosition.nearestStation} • Next stop {liveData.nextStation.name}
          </div>
        </div>

        {/* Copyable link input */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            readOnly
            value={shareUrl}
            style={{
              flex: 1,
              height: '44px',
              padding: '0 14px',
              fontSize: '13px',
              color: 'var(--color-text-primary)',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-base)',
              fontFamily: 'var(--font-mono)',
            }}
          />
          <button
            onClick={handleCopy}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0 18px',
              height: '44px',
              borderRadius: 'var(--radius-base)',
              backgroundColor: copied ? 'var(--color-success)' : 'var(--color-accent)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 600,
              transition: 'background 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

        {/* Share buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={handleWhatsAppShare}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              height: '44px',
              borderRadius: 'var(--radius-base)',
              backgroundColor: '#25D366',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(37, 211, 102, 0.3)',
              transition: 'all 0.15s',
            }}
          >
            <WhatsAppIcon size={18} />
            <span>Share via WhatsApp</span>
          </button>

          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                height: '44px',
                borderRadius: 'var(--radius-base)',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                fontSize: '14px',
                fontWeight: 600,
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface)')}
            >
              <ShareIcon size={18} />
              <span>More Share Options...</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
