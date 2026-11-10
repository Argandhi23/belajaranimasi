# Animation demos

The registry contains three allowlisted React components. Vite loads both each component and its exact TSX source lazily. Copying a source file gives a complete default-exported component with imports and inline styling; no private helper imports or application CSS are required. Use it in a React + TypeScript app with `gsap` and `@gsap/react`; the cube also requires `three` and `@react-three/fiber`.

Render the selected registry component inside React Suspense. Demos use the window's ordinary vertical scroll; do not place them inside a transformed or independently scrolling ancestor. Pin-scrub holds its stage for two viewport heights. Depth-parallax moves three layers by 100, 260, and 480 pixels across the same scroll interval. Scroll-cube maps the scroll range of its 240svh track to two mesh rotation axes.

Reduced motion is reactive. GSAP matchMedia reverts the first two demos, removing the pin spacer and transforms. The cube unmounts WebGL and displays an SVG illustration in normal flow. Renderer creation errors and context loss also produce that fallback. Cube resources are component-owned declarative R3F geometry/materials, disposed when unmounted. Demand rendering, capped DPR, visibility gating, and no continuous useFrame loop limit idle work. These are implementation choices, not a measured 60 fps guarantee.

Browser verification should cover forward/reverse scrolling, changing reduced motion while mounted, resizing, Strict Mode remounts, navigation away/back, disabled WebGL, and context loss. Stable selectors are `pin-stage`, `pin-square`, `parallax-back`, `parallax-middle`, `parallax-front`, `cube-track`, `cube-stage`, and `cube-fallback` through `data-testid`.
