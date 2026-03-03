/**
 * Icon exports for HugeIcons
 * Centralized icon imports from @hugeicons/core-free-icons
 */
import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'
import {
  Add as Add01IconSvg,
  Target as Target03IconSvg,
  ArrowLeft as ArrowLeft01IconSvg,
  ArrowRight as ArrowRight01IconSvg,
  Sparkles as SparklesIconSvg,
  Image as Image01IconSvg,
  Edit as Edit02IconSvg,
  Download as Download04IconSvg,
  Refresh as RefreshIconSvg,
  Clock as Clock01IconSvg,
  Magic as AiMagicIconSvg,
  Camera as Camera01IconSvg,
  Calendar as Calendar03IconSvg,
  Analytics as Analytics01IconSvg,
  Flash as Lightning01IconSvg,
  Building as Building03IconSvg,
  Menu as Menu01IconSvg,
  Copy as Copy01IconSvg,
  Delete as Delete02IconSvg,
  CheckmarkCircle02Icon as CheckmarkCircle02IconSvg,
  Checkmark as CheckIconSvg,
  Plus as PlusSignIconSvg,
  Upload as Upload04IconSvg,
  XCircle as XCircleIconSvg,
  Loading as Loading03IconSvg,
  Loader as Loader02IconSvg,
  Search as Search01IconSvg,
  Filter as Filter01IconSvg,
  Settings as Settings02IconSvg,
  Share as Share08IconSvg,
  Link as Link01IconSvg,
  ChevronLeft as ChevronLeft01IconSvg,
  ChevronRight as ChevronRight01IconSvg,
  ChevronDown as ChevronDown01IconSvg,
  MoreVertical as MoreVertical01IconSvg,
  AlertCircle as AlertCircle01IconSvg,
  CheckmarkCircle01Icon as CheckmarkCircle01IconSvg,
  Refresh as RotateCcwIconSvg,
  TrendingUp as TrendingUpIconSvg,
  Delete as Trash2IconSvg,
} from '@hugeicons/core-free-icons'

interface IconProps {
  className?: string
  size?: number
  strokeWidth?: number
}

// Helper to create icon wrapper components
function createIcon(iconSvg: IconSvgElement) {
  return ({ className, size = 20, strokeWidth = 1.5 }: IconProps) => (
    <HugeiconsIcon
      icon={iconSvg}
      size={size}
      strokeWidth={strokeWidth}
      className={className}
    />
  )
}

// Export all icons as React components
export const Add01Icon = createIcon(Add01IconSvg)
export const Target03Icon = createIcon(Target03IconSvg)
export const ArrowLeft01Icon = createIcon(ArrowLeft01IconSvg)
export const ArrowLeftIcon = createIcon(ArrowLeft01IconSvg) // Alias
export const ArrowRight01Icon = createIcon(ArrowRight01IconSvg)
export const SparklesIcon = createIcon(SparklesIconSvg)
export const Sparkles01Icon = createIcon(SparklesIconSvg) // Alias
export const Image01Icon = createIcon(Image01IconSvg)
export const ImageAddIcon = createIcon(Image01IconSvg) // Alias
export const Edit02Icon = createIcon(Edit02IconSvg)
export const Download04Icon = createIcon(Download04IconSvg)
export const Download01Icon = createIcon(Download04IconSvg) // Alias
export const RefreshIcon = createIcon(RefreshIconSvg)
export const ClockIcon = createIcon(Clock01IconSvg)
export const Clock01Icon = createIcon(Clock01IconSvg)
export const Magic01Icon = createIcon(AiMagicIconSvg)
export const AiMagicIcon = createIcon(AiMagicIconSvg)
export const Camera01Icon = createIcon(Camera01IconSvg)
export const Calendar03Icon = createIcon(Calendar03IconSvg)
export const Analytics01Icon = createIcon(Analytics01IconSvg)
export const Lightning01Icon = createIcon(Lightning01IconSvg)
export const Building03Icon = createIcon(Building03IconSvg)
export const Menu01Icon = createIcon(Menu01IconSvg)
export const Copy01Icon = createIcon(Copy01IconSvg)
export const Delete02Icon = createIcon(Delete02IconSvg)
export const CheckmarkCircle02Icon = createIcon(CheckmarkCircle02IconSvg)
export const CheckIcon = createIcon(CheckIconSvg)
export const PlusSignIcon = createIcon(PlusSignIconSvg)
export const PlusIcon = createIcon(PlusSignIconSvg) // Alias
export const Upload04Icon = createIcon(Upload04IconSvg)
export const XCircleIcon = createIcon(XCircleIconSvg)
export const Loading03Icon = createIcon(Loading03IconSvg)
export const Loader02Icon = createIcon(Loader02IconSvg)
export const Loader2Icon = createIcon(Loader02IconSvg) // Alias for Lucide compatibility
export const Search01Icon = createIcon(Search01IconSvg)
export const Filter01Icon = createIcon(Filter01IconSvg)
export const Settings02Icon = createIcon(Settings02IconSvg)
export const Share08Icon = createIcon(Share08IconSvg)
export const Link01Icon = createIcon(Link01IconSvg)
export const ExternalLinkIcon = createIcon(Link01IconSvg) // Use Link icon for external links
export const ChevronLeft01Icon = createIcon(ChevronLeft01IconSvg)
export const ChevronRight01Icon = createIcon(ChevronRight01IconSvg)
export const ChevronDown01Icon = createIcon(ChevronDown01IconSvg)
export const ChevronDownIcon = createIcon(ChevronDown01IconSvg) // Alias
export const MoreVertical01Icon = createIcon(MoreVertical01IconSvg)
export const AlertCircle01Icon = createIcon(AlertCircle01IconSvg)
export const AlertCircleIcon = createIcon(AlertCircle01IconSvg) // Alias
export const CheckmarkCircle01Icon = createIcon(CheckmarkCircle01IconSvg)
export const RotateCcwIcon = createIcon(RotateCcwIconSvg)
export const TrendingUpIcon = createIcon(TrendingUpIconSvg)
export const Trash2Icon = createIcon(Trash2IconSvg)
export const MenuIcon = createIcon(Menu01IconSvg) // Alias
export const ZapIcon = createIcon(Lightning01IconSvg) // Alias (Lucide name)
