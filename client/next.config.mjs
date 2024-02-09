/** @type {import('next').NextConfig} */
const nextConfig = {
	async rewrites() {
		return [
			{
				source: '/',
				destination: '/signin',
			},
		];
	},
	async redirects() {
		return [
			{
				source: '/',
				destination: '/signin',
				permanent: true,
			},
		];
	},
};

export default nextConfig;
