The homepage service tile — media block, title, description and a teal circular arrow. The whole card links out.

```jsx
<ServiceCard tone="dark" href="/ai" title="Data & Artificial Intelligence"
  description="Boost productivity with scalable data and AI solutions"
  media={<i data-lucide="brain-circuit"></i>} />
```

`tone`: `dark` (default, near-black tile) or `light`. Pass any node as `media`.
