/**
 * Icon exports for HugeIcons
 * Centralized icon imports from @hugeicons/core-free-icons
 */
import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'
import {
  Add01Icon as Add01IconSvg,
  Target03Icon as Target03IconSvg,
  ArrowLeft01Icon as ArrowLeft01IconSvg,
  ArrowRight01Icon as ArrowRight01IconSvg,
  SparklesIcon as SparklesIconSvg,
  Image01Icon as Image01IconSvg,
  Edit02Icon as Edit02IconSvg,
  Download04Icon as Download04IconSvg,
  RefreshIcon as RefreshIconSvg,
  Clock01Icon as Clock01IconSvg,
  AiMagicIcon as AiMagicIconSvg,
  Camera01Icon as Camera01IconSvg,
  Calendar03Icon as Calendar03IconSvg,
  Analytics01Icon as Analytics01IconSvg,
  FlashIcon as Lightning01IconSvg,
  Building03Icon as Building03IconSvg,
  Menu01Icon as Menu01IconSvg,
  Copy01Icon as Copy01IconSvg,
  Delete02Icon as Delete02IconSvg,
  CheckmarkCircle02Icon as CheckmarkCircle02IconSvg,
  Tick01Icon as CheckIconSvg,
  PlusSignIcon as PlusSignIconSvg,
  Upload04Icon as Upload04IconSvg,
  CancelCircleIcon as XCircleIconSvg,
  Loading03Icon as Loading03IconSvg,
  Loading02Icon as Loader02IconSvg,
  Search01Icon as Search01IconSvg,
  FilterIcon as Filter01IconSvg,
  Settings02Icon as Settings02IconSvg,
  Share08Icon as Share08IconSvg,
  Link01Icon as Link01IconSvg,
  ArrowLeft01Icon as ChevronLeft01IconSvg,
  ArrowRight01Icon as ChevronRight01IconSvg,
  ArrowDown01Icon as ChevronDown01IconSvg,
  MoreVerticalIcon as MoreVertical01IconSvg,
  AlertCircleIcon as AlertCircle01IconSvg,
  CheckmarkCircle01Icon as CheckmarkCircle01IconSvg,
  ArrowUpRight01Icon as TrendingUpIconSvg,
  ArrowUp as ArrowUp01IconSvg,
  ArrowDown as ArrowDown01IconSvg,
  FileText as FileText01IconSvg,
  Lightbulb as Lightbulb01IconSvg,
  Eye as Eye01IconSvg,
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
export const RotateCcwIcon = createIcon(RefreshIconSvg)
export const TrendingUpIcon = createIcon(TrendingUpIconSvg)
export const Trash2Icon = createIcon(Delete02IconSvg)
export const MenuIcon = createIcon(Menu01IconSvg) // Alias
export const ZapIcon = createIcon(Lightning01IconSvg) // Alias (Lucide name)
export const ArrowUp01Icon = createIcon(ArrowUp01IconSvg)
export const ArrowDown01Icon = createIcon(ArrowDown01IconSvg)
export const FileText01Icon = createIcon(FileText01IconSvg)
export const Lightbulb01Icon = createIcon(Lightbulb01IconSvg)
export const Eye01Icon = createIcon(Eye01IconSvg)
// Aliases for analytics
export const TrendUp01Icon = ArrowUp01Icon
export const TrendDown01Icon = ArrowDown01Icon
export const ChartHistogram01Icon = Analytics01Icon
export const Dashboard01Icon = Analytics01Icon
export const BarChart01Icon = Analytics01Icon
