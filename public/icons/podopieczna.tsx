type IconProps = {
    className?: string;
    width?: string;
    height?: string;
};

const Podopieczna = ({ width, height, className }: IconProps) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width={width} className={className} zoomAndPan="magnify" viewBox="0 0 375 374.999991" height={height} preserveAspectRatio="xMidYMid meet" version="1.0"><defs><clipPath id="bc14e43076"><path d="M 107 17.703125 L 268 17.703125 L 268 178 L 107 178 Z M 107 17.703125 " clip-rule="nonzero"/></clipPath><clipPath id="aa5ee2e571"><path d="M 65.671875 202 L 309.421875 202 L 309.421875 357.453125 L 65.671875 357.453125 Z M 65.671875 202 " clip-rule="nonzero"/></clipPath></defs><g clip-path="url(#bc14e43076)"><path fill="#f6d7d2" d="M 187.535156 177.378906 C 231.621094 177.378906 267.363281 141.636719 267.363281 97.550781 C 267.363281 53.464844 231.621094 17.726562 187.535156 17.726562 C 143.449219 17.726562 107.707031 53.464844 107.707031 97.550781 C 107.707031 141.636719 143.449219 177.378906 187.535156 177.378906 " fill-opacity="1" fill-rule="nonzero"/></g><g clip-path="url(#aa5ee2e571)"><path fill="#f6d7d2" d="M 187.535156 202.566406 C 120.25 202.566406 65.703125 250.617188 65.703125 317.902344 L 65.703125 357.339844 L 309.363281 357.339844 L 309.363281 317.902344 C 309.363281 250.617188 254.820312 202.566406 187.535156 202.566406 " fill-opacity="1" fill-rule="nonzero"/></g></svg>

    );
};
export default Podopieczna;
