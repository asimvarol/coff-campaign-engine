# 🍌 Fal.ai Nano Banana 2 - Integration Guide

**Model**: `fal-ai/nano-banana-2`  
**Status**: ✅ INTEGRATED  
**Updated**: 2026-03-02 23:50 GMT  

---

## 🚀 Model Features

**nano-banana-2** is Fal.ai's fastest high-quality image generation model:

- ⚡ **Speed**: ~2-3 seconds per image
- 🎨 **Quality**: High-quality outputs
- 💰 **Cost**: Lower cost than FLUX
- 🔧 **Flexible**: Multiple aspect ratios
- 🎯 **Optimized**: For product photography & marketing visuals

---

## 📦 Integration

### Client Library
**Path**: `apps/web/src/lib/fal-client.ts`

```typescript
import { generateImage } from '@/lib/fal-client'

// Basic usage
const result = await generateImage({
  prompt: 'Professional product photography',
  image_size: 'square_hd',
  num_images: 4,
})
```

### API Endpoint
**Path**: `/api/generate-image`

```bash
curl -X POST http://localhost:3001/api/generate-image \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Modern marketing visual",
    "image_size": "square_hd",
    "num_images": 2
  }'
```

---

## 🎨 Available Functions

### 1. generateImage()
**Core function** - Direct access to nano-banana-2:

```typescript
await generateImage({
  prompt: string,              // Required
  negative_prompt?: string,    // Optional
  image_size?: string,         // Default: 'square_hd'
  num_images?: number,         // Default: 1
  guidance_scale?: number,     // Default: 3.5
  num_inference_steps?: number,// Default: 28
  seed?: number,               // Optional (for reproducibility)
})
```

### 2. generatePhotoshoot()
**5 templates** for photoshoot studio:

```typescript
await generatePhotoshoot(
  'product',      // template: product | lifestyle | minimal | vibrant | monochrome
  'Coffee Mug',   // productName
  'modern'        // brandStyle (optional)
)
```

**Templates**:
- `product` - White background, studio lighting
- `lifestyle` - Natural setting, authentic
- `minimal` - Negative space, elegant
- `vibrant` - Bold colors, energetic
- `monochrome` - B&W, dramatic

### 3. generateCampaignCreative()
**Platform-optimized** campaign visuals:

```typescript
await generateCampaignCreative(
  'Summer Sale',     // campaignTheme
  'instagram',       // platform
  'blue and orange'  // brandColors (optional)
)
```

**Platforms**:
- `instagram` → square_hd
- `facebook` → landscape_16_9
- `twitter` → landscape_16_9
- `linkedin` → landscape_4_3
- `tiktok` → portrait_16_9
- `pinterest` → portrait_4_3

### 4. generateBrandAsset()
**4 asset types**:

```typescript
await generateBrandAsset(
  'hero',              // assetType: hero | banner | social | thumbnail
  'Launch campaign',   // description
  'minimalist'         // brandStyle (optional)
)
```

### 5. testFalAI()
**Quick test** function:

```typescript
const result = await testFalAI()
// Returns: 1 landscape image of a sunset
```

---

## 📏 Image Sizes

Available `image_size` options:

- `square` - 1:1 (1024x1024)
- `square_hd` - 1:1 HD (1536x1536) ⭐ **Recommended**
- `portrait` - 3:4 (768x1024)
- `portrait_4_3` - 4:3 vertical (1024x1365)
- `portrait_16_9` - 16:9 vertical (768x1365)
- `landscape` - 4:3 (1024x768)
- `landscape_4_3` - 4:3 horizontal (1365x1024)
- `landscape_16_9` - 16:9 horizontal (1365x768) ⭐ **Popular**

---

## ⚙️ Parameters

### guidance_scale
**Range**: 1.0 - 20.0  
**Default**: 3.5  
**Effect**: How closely to follow the prompt
- Lower (1-3): More creative/varied
- Medium (3-5): Balanced ⭐
- Higher (5-10): Stricter adherence

### num_inference_steps
**Range**: 1 - 50  
**Default**: 28  
**Effect**: Quality vs Speed
- Low (4-20): Faster, lower quality
- Medium (20-35): Balanced ⭐
- High (35-50): Slower, higher quality

### seed
**Optional**: For reproducible results  
**Example**: `seed: 42`

---

## 🎯 Use Cases

### Photoshoot Studio
**Path**: `/photoshoot/create`

```typescript
import { generatePhotoshoot } from '@/lib/fal-client'

const images = await generatePhotoshoot(
  'lifestyle',
  'Eco Water Bottle',
  'sustainable natural earth tones'
)
// Returns 4 lifestyle photos
```

### Campaign Creatives
**Path**: `/campaigns/[id]`

```typescript
import { generateCampaignCreative } from '@/lib/fal-client'

const creatives = await generateCampaignCreative(
  'Black Friday Sale - Up to 50% Off',
  'instagram',
  'black red gold'
)
// Returns 3 Instagram-optimized images
```

### Brand Assets
**Path**: `/brand/[id]`

```typescript
import { generateBrandAsset } from '@/lib/fal-client'

const hero = await generateBrandAsset(
  'hero',
  'Tech startup landing page',
  'modern tech blue gradient'
)
// Returns 2 hero images
```

---

## 🧪 Testing

### Test via API:
```bash
curl -X POST http://localhost:3001/api/generate-image \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Professional product photography of a coffee mug, white background, studio lighting",
    "image_size": "square_hd",
    "num_images": 1
  }'
```

### Test via Client:
```typescript
import { testFalAI } from '@/lib/fal-client'

const result = await testFalAI()
console.log('Generated:', result.images[0].url)
```

---

## 📝 Response Format

```typescript
{
  images: [
    {
      url: "https://fal.ai/files/...",
      width: 1536,
      height: 1536,
      content_type: "image/jpeg"
    }
  ],
  timings: {
    inference: 2.4  // seconds
  },
  seed: 1234567890,
  has_nsfw_concepts: [false],
  prompt: "Your prompt here"
}
```

---

## 🚨 Error Handling

```typescript
try {
  const result = await generateImage({ prompt: '...' })
} catch (error) {
  if (error.message.includes('FAL_AI_KEY')) {
    console.error('API key not configured')
  } else if (error.message.includes('400')) {
    console.error('Invalid parameters')
  } else if (error.message.includes('500')) {
    console.error('Fal.ai service error')
  }
}
```

---

## 💡 Best Practices

1. **Prompts**: Be specific and descriptive
   - ✅ "Professional product photography of a blue coffee mug, white background, studio lighting"
   - ❌ "coffee mug"

2. **Negative Prompts**: Use to avoid unwanted elements
   - Common: "blurry, low quality, distorted, ugly, bad anatomy"

3. **Image Size**: Use HD variants for print-ready quality
   - Online: `square` or `landscape_16_9`
   - Print: `square_hd` or `landscape_16_9` (HD versions)

4. **Batch Generation**: Request multiple images
   - `num_images: 4` → Get variety, pick best

5. **Seeds**: Save seed for reproducibility
   - Same seed + prompt = same image

---

## ✅ Integration Checklist

- [x] API key configured (`FAL_AI_KEY`)
- [x] Client library created (`fal-client.ts`)
- [x] API endpoint created (`/api/generate-image`)
- [x] Photoshoot templates (5)
- [x] Campaign creative generator
- [x] Brand asset generator
- [x] Error handling
- [ ] UI integration (photoshoot page)
- [ ] UI integration (campaign page)
- [ ] Loading states
- [ ] Image preview
- [ ] Download functionality

---

## 🔗 Resources

- **Fal.ai Docs**: https://fal.ai/models/fal-ai/nano-banana-2
- **Pricing**: https://fal.ai/pricing
- **Examples**: https://fal.ai/models/fal-ai/nano-banana-2/playground

---

**Model**: nano-banana-2 🍌  
**Status**: READY TO USE ✅  
**Performance**: ~2-3s per image ⚡  

