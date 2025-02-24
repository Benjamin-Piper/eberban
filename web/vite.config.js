import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import ViteYaml from "@modyfi/vite-plugin-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Adapted from https://github.com/vitejs/vite/issues/6596#issuecomment-1651355986
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
                const startWith = (s) => "^" + s;
                const group = (s) => `(?:${s})`;
                const ignore = (s) => `[^${s}]`;
                const zeroOrMore = (s) => s + "*";
                const oneOrMore = (s) => s + "+";
                const regex = new RegExp(
                    startWith("/") +
                    zeroOrMore(group(oneOrMore(ignore("@")) + "/")) +
                    oneOrMore(ignore("@./"))
                );
                console.log(regex);
                // todo continue adapting this. i'm nearly there
            });
        },
    }
}

export default {
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
    publicDir: "../images", // need to go one level up because our root is at src.
    root: "src",
};

// todo multipage build with root-geneartor
// https://github.com/vitejs/vite/pull/14756
// also figure out how to get trailing slashes and non-traliilng slashes working for urls
// i might have to downgrade to version 5 of vite
