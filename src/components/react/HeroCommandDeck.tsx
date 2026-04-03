import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";

import { useExperienceStore, type GatewayId } from "@/store/experienceStore";

import styles from "./HeroCommandDeck.module.css";

interface GatewayCardProps {
  id: GatewayId;
  label: string;
  title: string;
  summary: string;
  href: string;
  image: string;
}

interface HeroCommandDeckProps {
  gateways: GatewayCardProps[];
}

interface LiquidSurfaceProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  displacementScale?: number;
  blurAmount?: number;
  saturation?: number;
  aberrationIntensity?: number;
  elasticity?: number;
  cornerRadius?: number;
  padding?: string;
  mouseContainer?: RefObject<HTMLElement | null>;
  mode?: "standard" | "polar" | "prominent" | "shader";
}

const effectByGateway: Record<
  GatewayId,
  {
    displacementScale: number;
    blurAmount: number;
    saturation: number;
    aberrationIntensity: number;
    elasticity: number;
  }
> = {
  cyrus: {
    displacementScale: 58,
    blurAmount: 0.08,
    saturation: 148,
    aberrationIntensity: 1.7,
    elasticity: 0.22,
  },
  alpha: {
    displacementScale: 48,
    blurAmount: 0.1,
    saturation: 152,
    aberrationIntensity: 1.9,
    elasticity: 0.26,
  },
  corporate: {
    displacementScale: 42,
    blurAmount: 0.07,
    saturation: 138,
    aberrationIntensity: 1.45,
    elasticity: 0.16,
  },
  lab: {
    displacementScale: 54,
    blurAmount: 0.09,
    saturation: 155,
    aberrationIntensity: 2.1,
    elasticity: 0.28,
  },
};

function FallbackLiquidGlass({
  children,
  className = "",
  cornerRadius = 34,
  padding = "0",
  style,
}: LiquidSurfaceProps) {
  return (
    <div
      className={`${styles.fallbackLiquid} ${className}`.trim()}
      style={{ borderRadius: cornerRadius, padding, ...style }}
    >
      {children}
    </div>
  );
}

async function resolveLiquidGlassComponent() {
  const liquidModule = await import("liquid-glass-react");
  const moduleDefault = liquidModule.default as
    | ComponentType<LiquidSurfaceProps>
    | { default?: ComponentType<LiquidSurfaceProps> };

  if (typeof moduleDefault === "function") {
    return moduleDefault;
  }

  if (moduleDefault && typeof moduleDefault === "object" && typeof moduleDefault.default === "function") {
    return moduleDefault.default;
  }

  return FallbackLiquidGlass;
}

export default function HeroCommandDeck({ gateways }: HeroCommandDeckProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const setActiveGateway = useExperienceStore((state) => state.setActiveGateway);
  const [LiquidGlassSurface, setLiquidGlassSurface] = useState<ComponentType<LiquidSurfaceProps>>(
    () => FallbackLiquidGlass,
  );
  const cards = useMemo(() => gateways, [gateways]);

  useEffect(() => {
    let isMounted = true;

    resolveLiquidGlassComponent()
      .then((Component) => {
        if (isMounted) {
          setLiquidGlassSurface(() => Component);
        }
      })
      .catch(() => {
        if (isMounted) {
          setLiquidGlassSurface(() => FallbackLiquidGlass);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="hero-shell" id="top" data-fx-rise>
      <div className={styles.heroPanel} ref={panelRef} data-hero-panel>
        <div className={styles.heroCopy}>
          <div className={styles.heroBadge}>
            <span className={styles.dot} />
            BARUCHLOPEZ.COM / CENTRAL IDENTITY PORTAL
          </div>

          <h1 className={styles.title}>
            Baruch Lopez
            <br />
            <em>AI, systems, and capital.</em>
          </h1>

          <p className={styles.subline}>
            Artificial intelligence, strategic systems, and long-term capital vision.
          </p>
          <p className={styles.lead}>
            Technology and finance are tools. The mission is human progress.
          </p>
          <p className={styles.copy}>
            A curated gateway into my ventures, corporate background, selected work, and
            long-term direction.
          </p>
        </div>

        <div className={styles.portraitWrap} data-hero-portrait>
          <img
            className={styles.portraitImage}
            src="/assets/images/baruch-lopez-portrait.jpg"
            alt="Baruch Lopez portrait in a dark, cinematic setting."
            width="576"
            height="768"
            loading="eager"
          />
        </div>

        <div className={styles.gatewayShell} id="gateways">
          <LiquidGlassSurface
            className={styles.liquidWrap}
            displacementScale={34}
            blurAmount={0.08}
            saturation={148}
            aberrationIntensity={1.4}
            elasticity={0.18}
            cornerRadius={34}
            padding="0"
            mouseContainer={panelRef}
            mode="polar"
            style={{ width: "100%", display: "block" }}
          >
            <div className={styles.gatewayPanel}>
              <div className={styles.gatewayHeading}>
                <span className={styles.eyebrow}>Core Domains</span>
                <p>Four domains, one central identity.</p>
              </div>

              <div className={styles.gatewayGrid}>
                {cards.map((gateway) => (
                  <LiquidGlassSurface
                    key={gateway.id}
                    className={styles.liquidWrap}
                    cornerRadius={24}
                    padding="0"
                    mouseContainer={panelRef}
                    mode="standard"
                    style={{ width: "100%", display: "block" }}
                    {...effectByGateway[gateway.id]}
                  >
                    <a
                      className={styles.gatewayCard}
                      href={gateway.href}
                      onMouseEnter={() => setActiveGateway(gateway.id)}
                      onFocus={() => setActiveGateway(gateway.id)}
                      onClick={() => setActiveGateway(gateway.id)}
                    >
                      <img
                        className={styles.gatewayImage}
                        src={gateway.image}
                        alt=""
                        loading="lazy"
                      />

                      <div className={styles.gatewayCopy}>
                        <span className={styles.miniLabel}>{gateway.label}</span>
                        <h2 className={styles.gatewayTitle}>{gateway.title}</h2>
                        <p className={styles.gatewaySummary}>{gateway.summary}</p>
                      </div>
                    </a>
                  </LiquidGlassSurface>
                ))}
              </div>
            </div>
          </LiquidGlassSurface>
        </div>
      </div>
    </section>
  );
}
