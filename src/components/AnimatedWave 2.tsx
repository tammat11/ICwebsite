export default function AnimatedWave() {
    return (
        <div className="relative w-full h-[10vh] min-h-[50px] max-h-[150px] overflow-hidden leading-[0] z-20">
            <svg
                className="absolute block w-[200%] h-full left-0 bottom-0"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 24 150 28"
                preserveAspectRatio="none"
                shapeRendering="auto"
            >
                <defs>
                    <path
                        id="gentle-wave"
                        d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
                    />
                </defs>
                <g className="parallax-waves">
                    <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(46, 204, 113, 0.7)" />
                    <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(46, 204, 113, 0.5)" />
                    <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(46, 204, 113, 0.3)" />
                    <use xlinkHref="#gentle-wave" x="48" y="7" fill="#2ecc71" />
                </g>
            </svg>
            <style>{`
                .parallax-waves > use {
                    animation: move-forever 25s cubic-bezier(.55,.5,.45,.5) infinite;
                }
                .parallax-waves > use:nth-child(1) {
                    animation-delay: -2s;
                    animation-duration: 7s;
                }
                .parallax-waves > use:nth-child(2) {
                    animation-delay: -3s;
                    animation-duration: 10s;
                }
                .parallax-waves > use:nth-child(3) {
                    animation-delay: -4s;
                    animation-duration: 13s;
                }
                .parallax-waves > use:nth-child(4) {
                    animation-delay: -5s;
                    animation-duration: 20s;
                }

                @keyframes move-forever {
                    0% {
                        transform: translate3d(-90px, 0, 0);
                    }
                    100% {
                        transform: translate3d(85px, 0, 0);
                    }
                }
            `}</style>
        </div>
    );
}
