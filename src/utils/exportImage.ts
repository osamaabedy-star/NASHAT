import { toPng, toJpeg } from 'html-to-image';

export interface ExportImageResult {
  dataUrl: string;
  fileName: string;
}

export async function exportElementAsImage(
  elementId: string,
  fileName: string = 'schedule',
  format: 'png' | 'jpeg' = 'png'
): Promise<string> {
  const node = document.getElementById(elementId);
  if (!node) {
    const errorMsg = `العنصر برقم "${elementId}" غير موجود في الصفحة.`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  // Determine required canvas width based on document type
  // Master table (14 columns) needs 1850px for crisp, unclipped layout
  // Teacher/Week/Class/Report tables (6 columns) need 1250px for standard A4 landscape
  const isMasterTable = elementId.includes('master');
  const targetWidth = isMasterTable ? 1850 : 1250;

  // Create an offscreen staging container attached to DOM so all styles & fonts apply
  const stagingWrapper = document.createElement('div');
  stagingWrapper.setAttribute('id', `staging-${Date.now()}`);
  stagingWrapper.style.position = 'fixed';
  stagingWrapper.style.top = '0';
  stagingWrapper.style.left = '0';
  stagingWrapper.style.width = `${targetWidth}px`;
  stagingWrapper.style.minWidth = `${targetWidth}px`;
  stagingWrapper.style.maxWidth = `${targetWidth}px`;
  stagingWrapper.style.zIndex = '-9999';
  stagingWrapper.style.opacity = '1';
  stagingWrapper.style.pointerEvents = 'none';
  stagingWrapper.style.backgroundColor = '#ffffff';
  stagingWrapper.style.direction = 'rtl';

  // Deep clone the document card
  const clone = node.cloneNode(true) as HTMLElement;
  clone.style.width = `${targetWidth}px`;
  clone.style.minWidth = `${targetWidth}px`;
  clone.style.maxWidth = `${targetWidth}px`;
  clone.style.backgroundColor = '#ffffff';
  clone.style.boxSizing = 'border-box';
  clone.style.margin = '0';
  clone.style.borderRadius = '0';

  // 1. Remove all elements with .no-image-export or .no-print
  clone.querySelectorAll('.no-image-export, .no-print').forEach((el) => el.remove());

  // 2. Expand all scrollable containers and tables so nothing is clipped
  clone.querySelectorAll('*').forEach((el) => {
    const htmlEl = el as HTMLElement;
    if (
      htmlEl.classList.contains('overflow-x-auto') ||
      htmlEl.classList.contains('overflow-hidden') ||
      htmlEl.style.overflow === 'auto' ||
      htmlEl.style.overflow === 'hidden'
    ) {
      htmlEl.style.overflow = 'visible';
      htmlEl.style.maxWidth = 'none';
    }
  });

  // 3. For all tables, ensure 100% width
  clone.querySelectorAll('table').forEach((tbl) => {
    tbl.style.width = '100%';
    tbl.style.minWidth = '100%';
    tbl.style.tableLayout = 'auto';
  });

  // 4. Remove sticky positioning in export layout so columns align naturally
  clone.querySelectorAll('.sticky').forEach((el) => {
    (el as HTMLElement).style.position = 'static';
  });

  stagingWrapper.appendChild(clone);
  document.body.appendChild(stagingWrapper);

  try {
    // Small delay to allow the browser layout & font rendering engine to paint the clone
    await new Promise((resolve) => setTimeout(resolve, 150));

    const options = {
      backgroundColor: '#ffffff',
      cacheBust: true,
      skipFonts: true, // Prevents security errors when reading remote Google Fonts cssRules
      fontEmbedCSS: '',
      pixelRatio: 2, // High-res 300 DPI equivalent for ministerial crispness
      width: targetWidth,
      height: clone.scrollHeight,
    };

    let dataUrl: string;
    if (format === 'jpeg') {
      dataUrl = await toJpeg(clone, { ...options, quality: 0.98 });
    } else {
      dataUrl = await toPng(clone, options);
    }

    // Convert dataUrl to blob & file for mobile share / download
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const fileNameFull = `${fileName}.${format}`;
    const file = new File([blob], fileNameFull, {
      type: format === 'jpeg' ? 'image/jpeg' : 'image/png',
    });

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    let shared = false;

    // Trigger mobile Web Share API if supported
    if (isMobile && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: fileName.replace(/_/g, ' '),
        });
        shared = true;
      } catch (shareErr) {
        console.log('Share dismissed or cancelled:', shareErr);
      }
    }

    // Always trigger direct download
    const link = document.createElement('a');
    link.download = fileNameFull;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Dispatch event to show success modal / preview
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('export-completed', {
          detail: { dataUrl, fileName: fileNameFull, isMobile, shared },
        })
      );
    }

    return dataUrl;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  } finally {
    if (stagingWrapper && stagingWrapper.parentNode) {
      stagingWrapper.parentNode.removeChild(stagingWrapper);
    }
  }
}
