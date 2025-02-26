import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"
import ViteYaml from "@modyfi/vite-plugin-yaml";

// Adapted from https://github.com/vitejs/vite/issues/6596#issuecomment-1651355986
// Note: this only changes the request, it does NOT change the url on the browser.
const AppendTrailingUrlSlash = () => {
    return {
        name: "append-trailing-url-slash",
        apply: "serve",
        enforce: "post",
        configureServer(server) {
            server.middlewares.use((req, _, next) => {
                if (!req.url) {
                    return next();
                }
                const start = "^";
                const end = "$";
                const group = (s) => `(?:${s})`;
                const ignore = (s) => `[^${s}]`;
                const zeroOrMore = (s) => s + "*";
                const oneOrMore = (s) => s + "+";
                const regexp = new RegExp(
                    start +
                        "/" +
                        zeroOrMore(group(oneOrMore(ignore("@")) + "/")) +
                        oneOrMore(ignore("@./")) +
                        end,
                    "g",
                );
                if (regexp.test(req.url)) {
                    req.url += "/"
                }
                next();
            });
        },
    }
}

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    appType: "mpa", // multi-page application
    build: {
        rollupOptions: {
            input: {
                "main": resolve(__dirname, "index.html"),
                "root-generator": resolve(__dirname, "root-generator/index.html"),
            },
        },
    },
    plugins: [AppendTrailingUrlSlash(), ViteYaml()],
    // the root is specified within package.json scripts via Vite CLI
    publicDir: "../images",
});
