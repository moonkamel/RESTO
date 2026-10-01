import { withContentCollections } from "@content-collections/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

// withContentCollections doit rester le dernier plugin appliqué.
export default withContentCollections(nextConfig);
