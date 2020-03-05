
import Finomancer from "layouts/Finomancer"
const routes = [{
	path: "/",
	// component: () => import('layouts/MyLayout.vue'),
	// children: [
	//   { path: '', component: () => import('pages/Index.vue') }
	// ]
	component: Finomancer
}]

// Always leave this as last one
if (process.env.MODE !== "ssr") {
	routes.push({
		path: "*",
		component: () => import("pages/Error404.vue")
	})
}

export default routes
