import { ThemeProvider } from "@/components/theme-provider";
import { Layout } from "@/components/layout";
import { Player } from "@/widgets/player";
import { Queue } from "@/widgets/queue";
import { Library } from "@/widgets/library";
import { LocalImporter } from "./widgets/local-importer";
// import { Visualizer } from "./widgets/visualizer";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Layout>
        <section className="container grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 pt-6 md:py-10">
          <Player />
          <LocalImporter />

          <Queue />
          <Library />

          {/* <Visualizer /> */}
        </section>
      </Layout>
    </ThemeProvider>
  );
}
