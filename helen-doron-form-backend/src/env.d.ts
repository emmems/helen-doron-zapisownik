type KVNamespace = import("@cloudflare/workers-types").KVNamespace;
type ENV = {
	SESSION: KVNamespace;
};


type Runtime = import("@astrojs/cloudflare").Runtime<ENV>;
declare namespace App {
	interface Locals extends Runtime {}
}
/// <reference types="astro/client" />
