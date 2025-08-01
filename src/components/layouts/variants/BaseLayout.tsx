import { useSelector } from "react-redux";
import type { RootState } from "../../../Redux/Store";
import { BaseLayoutProps } from "@/Common/interface";

export default function BaseLayout({
  children,
  sidebar,
  navbar,
  footer,
}: BaseLayoutProps) {
  const { navbarPosition, sidebarStyle } = useSelector(
    (state: RootState) => state.settings
  );
  const sidebarWidth =
    sidebarStyle === "full" ? 180 : sidebarStyle === "compact" ? 50 : 0;

  return (
    <div
      className="flex h-screen w-screen overflow-hidden bg-background-paper"
      style={{
        scrollbarWidth: "none",
      }}
    >
      <div
        className="flex fixed h-screen w-screen overflow-auto"
        style={{
          scrollbarWidth: "none",
        }}
      >
        {sidebar}
      </div>

      <div
        className="flex flex-1 flex-col min-h-screen"
        style={{
          scrollbarWidth: "none",
          width: `calc(100vw - ${sidebarWidth}px)`,
        }}
      >
        <div
          className="flex w-full h-auto"
          style={{
            ...(navbarPosition === "fixed" && {
              position: "fixed",
              top: 0,
              right: 0,
              left: sidebarWidth,
              zIndex: 10,
            }),
            scrollbarWidth: "none",
          }}
        >
          {navbar}
        </div>

        <div
          className="flex flex-1 flex-col h-screen overflow-auto"
          style={{
            marginLeft: `${sidebarWidth + 100}px`,
            scrollbarWidth: "none",
          }}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex w-full sticky bottom-0 z-[1100]">{footer}</div>
        )}
      </div>
    </div>
  );
}
