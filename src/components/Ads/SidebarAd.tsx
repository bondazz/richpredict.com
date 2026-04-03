import React from 'react';

export default function SidebarAd() {
    const adContent = `
        <body style="margin: 0px; overflow: hidden; background: transparent; display: flex; justify-content: center; align-items: center; min-height: 240px;">
            <a target="_blank" href="https://campaigns.williamhill.com/C.ashx?btag=a_87b_1052c_&amp;affid=1213609&amp;siteid=87&amp;adid=1052&amp;c=" style="display: block; width: 100%;">
                <img width="100%" src="https://s0.2mdn.net/simgad/6555778137942114752" style="display: block; border: 0;">
            </a>
        </body>
    `;

    return (
        <div className="flex flex-col items-center justify-center py-4 px-2 w-full">
            <div className="relative w-[120px] h-[241px] bg-black/20 border border-white/5 rounded overflow-hidden flex items-center justify-center group">
                <iframe
                    srcDoc={adContent}
                    width="120"
                    height="240"
                    frameBorder="0"
                    scrolling="no"
                    title="Sidebar Ad"
                    className="opacity-90 group-hover:opacity-100 transition-opacity"
                />
            </div>
            <div className="text-[8px] font-medium text-white/50 uppercase tracking-widest mt-2 text-center">Advertisement</div>
        </div>
    );
}
