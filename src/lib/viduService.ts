export interface ViduVideoRequest {
  prompt: string;
  style?: string;
  aspect_ratio?: string;
  seed?: number;
  movement_amplitude?: string;
  type?: 'universe' | 'fate' | 'astrology' | 'default';
}

export interface ViduTaskResponse {
  status: string;
  request_id: string;
  response_url: string;
  status_url: string;
  cancel_url: string;
  logs: string | null;
  metrics: Record<string, unknown>;
  queue_position: number;
}

export interface ViduVideoResult {
  status: 'COMPLETED' | 'FAILED' | 'IN_QUEUE' | 'PROCESSING';
  video_url?: string;
  error?: string;
  request_id: string;
}

const VIDU_API_URL = 'http://localhost:3001/api/vidu/video';

export async function generateViduVideo(params: ViduVideoRequest): Promise<ViduTaskResponse> {
  const response = await fetch(VIDU_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...params,
      type: params.type || 'default',
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || '视频生成请求失败');
  }

  return response.json();
}

export async function checkViduTaskStatus(statusUrl: string): Promise<ViduVideoResult> {
  const response = await fetch(statusUrl);
  
  if (!response.ok) {
    throw new Error('查询视频状态失败');
  }

  const data = await response.json();
  return {
    status: data.status as ViduVideoResult['status'],
    video_url: data.video_url,
    error: data.error,
    request_id: data.request_id,
  };
}

export async function waitForViduVideo(requestId: string, statusUrl: string, maxWaitSeconds = 120): Promise<ViduVideoResult> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitSeconds * 1000) {
    const result = await checkViduTaskStatus(statusUrl);
    
    if (result.status === 'COMPLETED') {
      return result;
    }
    
    if (result.status === 'FAILED') {
      throw new Error(result.error || '视频生成失败');
    }
    
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  throw new Error('视频生成超时');
}

export function generateUniversePrompt(universeName: string, description: string): string {
  return `A cinematic, ultra-realistic scene depicting ${universeName}. ${description} The scene features breathtaking cosmic landscapes with swirling nebulae, distant galaxies, and ethereal light rays. Highly detailed, photorealistic, cinematic lighting, 8K resolution, dramatic composition, sci-fi fantasy style with vibrant colors and deep space atmosphere.`;
}

export function generateFateScenePrompt(lifeNode: string, choice: string, outcome: string): string {
  return `A dramatic cinematic scene showing a pivotal moment in someone's life: ${lifeNode}. The person is making a critical decision to ${choice}, leading to ${outcome}. The scene is emotionally charged with symbolic visual elements representing destiny and choice. Ultra-realistic, cinematic lighting, emotional atmosphere, symbolic imagery, professional film composition.`;
}

export function generateDestinyMontagePrompt(name: string, highlights: string[]): string {
  const highlightsText = highlights.join(' | ');
  return `A cinematic montage showing the life journey of ${name}. The video flows through key life moments: ${highlightsText}. Each scene transitions smoothly to the next, creating an emotional and inspiring narrative. Beautiful cinematography, warm nostalgic tones, professional editing style, uplifting music visual representation, photorealistic.`;
}

export function generateStarChartPrompt(zodiac: string, element: string): string {
  return `A mystical astrological star chart with ${zodiac} constellation. The ${element} element energy flows through the cosmic map, with glowing stars forming intricate patterns. Ancient Chinese astrology style meets modern visualization, deep space background with ethereal light effects, sacred geometry patterns, mystical and mysterious atmosphere, ultra detailed.`;
}