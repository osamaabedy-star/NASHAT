import { toPng, toJpeg } from 'html-to-image';

export async function exportElementAsImage(
  elementId: string,
  fileName: string = 'schedule',
  format: 'png' | 'jpeg' = 'png'
): Promise<void> {
  const node = document.getElementById(elementId);
  if (!node) {
    console.error(`Element with id ${elementId} not found.`);
    return;
  }

  try {
    const options = {
      backgroundColor: '#ffffff',
      cacheBust: true,
      pixelRatio: 2, // High resolution for crisp text & printing/sharing
      filter: (domNode: HTMLElement) => {
        // Exclude elements with no-image-export class
        if (domNode.classList && domNode.classList.contains('no-image-export')) {
          return false;
        }
        return true;
      },
    };

    let dataUrl: string;
    if (format === 'jpeg') {
      dataUrl = await toJpeg(node, { ...options, quality: 0.95 });
    } else {
      dataUrl = await toPng(node, options);
    }

    const link = document.createElement('a');
    link.download = `${fileName}.${format}`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}
