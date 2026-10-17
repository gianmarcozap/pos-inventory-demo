import React from 'react'

interface ApparelIconProps {
  tag: string
  color?: string
  className?: string
}

export const ApparelIcon: React.FC<ApparelIconProps> = ({ tag, color = '#FFD54F', className = 'w-16 h-16' }) => {
  switch (tag) {
    case 'vestido-midi':
    case 'vestido-camisero':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M26 12L38 12L42 22L36 24L36 30L46 54H18L28 30L28 24L22 22L26 12Z" fill={color} fillOpacity="0.25" stroke="#1C1917" strokeWidth="2.2" strokeLinejoin="round"/>
          <path d="M26 12C28 16 36 16 38 12" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round"/>
          <path d="M28 24C31 26 33 26 36 24" stroke="#1C1917" strokeWidth="1.8"/>
          <line x1="26" y1="30" x2="38" y2="30" stroke="#1C1917" strokeWidth="2"/>
          <circle cx="32" cy="18" r="1.5" fill="#1C1917"/>
        </svg>
      )
    case 'vestido-fiesta':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M26 10L24 18L30 26L20 54H44L34 26L40 18L38 10" fill={color} fillOpacity="0.25" stroke="#1C1917" strokeWidth="2.2" strokeLinejoin="round"/>
          <path d="M24 18C28 22 36 22 40 18" stroke="#1C1917" strokeWidth="2" strokeLinecap="round"/>
          <path d="M30 26H34" stroke="#1C1917" strokeWidth="2.2"/>
          <path d="M20 54L32 38L44 54" stroke={color} strokeWidth="2.5" strokeOpacity="0.6"/>
        </svg>
      )
    case 'blusa-lino':
    case 'top-ribbed':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M24 16L40 16L48 24L42 30L38 28L38 48H26L26 28L22 30L16 24L24 16Z" fill={color} fillOpacity="0.25" stroke="#1C1917" strokeWidth="2.2" strokeLinejoin="round"/>
          <path d="M28 16L32 23L36 16" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round"/>
          <line x1="32" y1="23" x2="32" y2="48" stroke="#1C1917" strokeWidth="1.5" strokeDasharray="3 3"/>
        </svg>
      )
    case 'blusa-abullonada':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M25 18C25 18 20 22 15 28C14 34 18 36 22 32L26 28V46H38V28L42 32C46 36 50 34 49 28C44 22 39 18 39 18H25Z" fill={color} fillOpacity="0.25" stroke="#1C1917" strokeWidth="2.2" strokeLinejoin="round"/>
          <path d="M27 18C29 23 35 23 37 18" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round"/>
        </svg>
      )
    case 'pantalon-wide':
    case 'jeans-mom':
    case 'pantalon-culotte':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M22 16H42V20L39 52H33L32 30L31 52H25L22 20V16Z" fill={color} fillOpacity="0.2" stroke="#1C1917" strokeWidth="2.2" strokeLinejoin="round"/>
          <line x1="22" y1="20" x2="42" y2="20" stroke="#1C1917" strokeWidth="2"/>
          <path d="M29 24C30 26 31 26 32 24" stroke="#1C1917" strokeWidth="1.8"/>
          <path d="M25 24H28" stroke="#1C1917" strokeWidth="1.5"/>
          <path d="M36 24H39" stroke="#1C1917" strokeWidth="1.5"/>
        </svg>
      )
    case 'conjunto-blazer':
    case 'conjunto-boho':
    case 'conjunto-tropical':
    default:
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M20 16L32 16L44 16L48 24L42 27L42 36H22V27L16 24L20 16Z" fill={color} fillOpacity="0.25" stroke="#1C1917" strokeWidth="2.2" strokeLinejoin="round"/>
          <path d="M22 40H42L40 52H24L22 40Z" fill={color} fillOpacity="0.15" stroke="#1C1917" strokeWidth="2.2" strokeLinejoin="round"/>
          <line x1="32" y1="16" x2="32" y2="36" stroke="#1C1917" strokeWidth="1.8"/>
        </svg>
      )
  }
}
