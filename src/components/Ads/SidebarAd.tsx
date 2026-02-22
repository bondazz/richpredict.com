import React from 'react';

export default function SidebarAd() {
    const adContent = `
        <body style="margin: 0px; overflow: hidden; background: transparent;">
            <script async src="https://z.cdn.ftd.agency/load?z=1971977102&amp;div=l2otb8albzk&amp;cw=120&amp;ch=240&amp;sr=1536x960&amp;tz=240&amp;bh=2&amp;tl=398&amp;pl=5&amp;mi=2&amp;me=8&amp;hc=16&amp;n=1771762966171&amp;url=www.flashscore.com%2F&amp;vc=ANGLE%20(AMD%2C%20AMD%20Radeon(TM)%20860M%20Graphics%20(0x00001114)%20Direct3D11%20vs_5_0%20ps_5_0%2C%20D3D11)&amp;ref=www.flashscore.com%2F&amp;zyx=999863170"></script>
            <script async src="//cdn.ftd.agency/libs/e.js"></script>
            <script>
                (function(w,d,o,g,r,a,m){
                    var cid=(Math.random()*1e17).toString(36);d.write('<div id="'+cid+'"></div>');
                    w[r]=w[r]||function(){(w[r+'l']=w[r+'l']||[]).push(arguments)};
                    function e(b,w,r){if((w[r+'h']=b.pop())&&!w.ABN){
                        var a=d.createElement(o),p=d.getElementsByTagName(o)[0];a.async=1;
                        a.src='//cdn.'+w[r+'h']+'/libs/e.js';a.onerror=function(){e(g,w,r)};
                        p.parentNode.insertBefore(a,p)}}e(g,w,r);
                    w[r](cid,{id:1971977102,domain:w[r+'h']});
                })(window,document,'script',['ftd.agency'],'ABNS');
            </script>
            <div id="l2otb8albzk" style="z-index: 2147483600;">
                <a href="https://z.cdn.ftd.agency/go?z=1971977102&amp;m=1570553514&amp;c=1711918628&amp;p0=2095667898&amp;u=9791a2b96d783e9e&amp;up=4cb1480c74d08543&amp;t=1771762962&amp;n=456422837597028810&amp;h=288939291&amp;iab1=1700" target="_blank" rel="nofollow" style="display: block; margin: auto; outline: none; text-align: center; line-height: 0; max-width: none;">
                    <img src="https://f7.cdn.ftd.agency/uploads/media/8/1/125418/v2/In-Pursuit-of-the-Scudetto-25_26_120x240_AZ.gif" width="120" style="position: static; width: 120px; height: auto;">
                </a>
            </div>
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
            <div className="text-[6px] font-black text-white/10 uppercase tracking-[0.3em] mt-2 text-center">Advertisement</div>
        </div>
    );
}
