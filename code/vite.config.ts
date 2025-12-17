import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@components": path.resolve(__dirname, "./src/app/components"),
            "@types": path.resolve(__dirname, "./src/types"),
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        port: 5225,
        strictPort: true,
    },
    build: {
        outDir: "dist",
    },
});
