<section class="flex flex-col justify-center antialiased min-h-full m-2 mt-0">
    <div class="max-w-full mx-auto p-4 sm:px-6 h-full">
        <div class="card w-full bg-base-100 border border-base-300 shadow-xl">
            <header class="px-5 py-4 b flex flex-col md:flex-row items-center justify-between min-w-full">
                <h2 class="font-semibold text-xl mr-5">Analisis</h2>
                <div class="flex mt-5 md:mt-0">
                    <button class="btn btn-primary m-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-filter"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                    </button>
                    <a href="/analysis/role" class="btn btn-primary m-2">
                        Rol
                    </a>
                    <a href="/analysis/jobs" class="btn btn-primary m-2">
                        Trabajos
                    </a>
                </div>
            </header>
            <div class="px-5 py-1">
                <div class="flex flex-wrap overflow-scroll">
                    <slot />
                </div>
            </div>
        </div>
    </div>
</section>