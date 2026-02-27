/**
 * Icon wrapper for HugeIcons
 * Maps common icon names to HugeIcons components
 */
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Add as AddIcon,
  Target as TargetIcon,
  ArrowBigLeft as ArrowLeftIcon,
  ArrowBigRight as ArrowRightIcon,
  Sparkles as SparklesIcon,
  Image as ImageIcon,
  BookEditFreeIcons as EditIconData,
  Download01FreeIcons as DownloadIconData,
  Refresh as RefreshIcon,
  Clock as ClockIcon,
  AiMagicFreeIcons as MagicIconData,
  Camera01FreeIcons as CameraIconData,
  Calendar03FreeIcons as CalendarIconData,
  Analytics01FreeIcons as AnalyticsIconData,
  Lightning01FreeIcons as LightningIconData,
  Building03FreeIcons as BuildingIconData,
  Menu01FreeIcons as MenuIconData,
  Copy01FreeIcons as CopyIconData,
  Delete02FreeIcons as DeleteIconData,
  TickDouble02FreeIcons as CheckmarkIconData,
} from '@hugeicons/core-free-icons'

interface IconProps {
  className?: string
  size?: number
  color?: string
  strokeWidth?: number
}

// Helper to create icon components
const createIcon = (iconData: any) => {
  return ({ className, size = 16, color = 'currentColor', strokeWidth = 1.5 }: IconProps) => (
    <HugeiconsIcon
      icon={iconData}
      className={className}
      size={size}
      color={color}
      strokeWidth={strokeWidth}
    />
  )
}

// Export wrapped icons with consistent naming
export const Add01Icon = ({ className, size }: IconProps) => (
  <HugeiconsIcon icon={AddIcon} className={className} size={size || 16} />
)

export const Target03Icon = ({ className, size }: IconProps) => (
  <HugeiconsIcon icon={TargetIcon} className={className} size={size || 16} />
)

export const ArrowLeft01Icon = ({ className, size }: IconProps) => (
  <HugeiconsIcon icon={ArrowLeftIcon} className={className} size={size || 16} />
)

export const ArrowRight01Icon = ({ className, size }: IconProps) => (
  <HugeiconsIcon icon={ArrowRightIcon} className={className} size={size || 16} />
)

export const Sparkles01Icon = ({ className, size }: IconProps) => (
  <HugeiconsIcon icon={SparklesIcon} className={className} size={size || 16} />
)

export const Image01Icon = ({ className, size }: IconProps) => (
  <HugeiconsIcon icon={ImageIcon} className={className} size={size || 16} />
)

export const Edit02Icon = createIcon(EditIconData)
export const Download04Icon = createIcon(DownloadIconData)
export const RefreshIcon = ({ className, size }: IconProps) => (
  <HugeiconsIcon icon={RefreshIcon} className={className} size={size || 16} />
)
export const ClockIcon = ({ className, size }: IconProps) => (
  <HugeiconsIcon icon={ClockIcon} className={className} size={size || 16} />
)
export const Magic01Icon = createIcon(MagicIconData)
export const Camera01Icon = createIcon(CameraIconData)
export const Calendar03Icon = createIcon(CalendarIconData)
export const Analytics01Icon = createIcon(AnalyticsIconData)
export const Lightning01Icon = createIcon(LightningIconData)
export const Building03Icon = createIcon(BuildingIconData)
export const Menu01Icon = createIcon(MenuIconData)
export const Copy01Icon = createIcon(CopyIconData)
export const Delete02Icon = createIcon(DeleteIconData)
export const CheckmarkCircle02Icon = createIcon(CheckmarkIconData)
