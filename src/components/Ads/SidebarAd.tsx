import React from 'react';

export default function SidebarAd() {
    return (
        <div className="flex flex-col items-center justify-center py-4 px-2 w-full">
            <div className="text-[7px] font-black text-white/20 uppercase tracking-[0.2em] mb-1 text-center">Advertisement</div>
            <div className="relative w-[120px] h-[240px] bg-black/20 border border-white/5 rounded overflow-hidden flex items-center justify-center group">
                <iframe
                    src="https://z.cdn.ftd.agency/load?z=1971977102&div=l2otb8albzk&cw=120&ch=240&sr=1536x960&tz=240&bh=2&tl=398&pl=5&mi=2&me=8&hc=16&n=1771762966171&url=www.flashscore.com%2F&vc=ANGLE%20(AMD%2C%20AMD%20Radeon(TM)%20860M%20Graphics%20(0x00001114)%20Direct3D11%20vs_5_0%20ps_5_0%2C%20D3D11)&ref=www.flashscore.com%2F&zyx=999863170"
                    width="120"
                    height="240"
                    frameBorder="0"
                    scrolling="no"
                    title="Sidebar Ad"
                    className="opacity-80 group-hover:opacity-100 transition-opacity"
                />
            </div>
        </div>
    );
}
