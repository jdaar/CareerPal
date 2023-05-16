<script lang="ts" setup>
    import { Chart, registerables } from 'chart.js';
    import { WordCloudController, WordElement } from 'chartjs-chart-wordcloud';

    import { page } from '$app/stores';
    import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import type { TMetrics } from '$lib/scraper/lib/datasource';

    const { metrics, row_count } = $page.data

    let COPFormat = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
    });

    // Helper function to display thousands in K format
    const formatThousands = (value: number) =>
    Intl.NumberFormat("en-US", {
        maximumSignificantDigits: 3,
        notation: "compact",
    }).format(value);

    Chart.register(...registerables);
    Chart.register(WordCloudController, WordElement);

    onMount(() => {
        

        if (browser) {
            // Define Chart.js default settings
            Chart.defaults.font.family = '"Inter", sans-serif';
            Chart.defaults.font.weight = "500";
            Chart.defaults.color = "rgb(148, 163, 184)";
            Chart.defaults.scale.grid.color = "rgb(241, 245, 249)";
            Chart.defaults.plugins.tooltip.titleColor = "rgb(30, 41, 59)";
            Chart.defaults.plugins.tooltip.bodyColor = "rgb(30, 41, 59)";
            Chart.defaults.plugins.tooltip.backgroundColor = "#FFF";
            Chart.defaults.plugins.tooltip.borderWidth = 1;
            Chart.defaults.plugins.tooltip.borderColor = "rgb(226, 232, 240)";
            Chart.defaults.plugins.tooltip.displayColors = false;
            Chart.defaults.plugins.tooltip.mode = "nearest";
            Chart.defaults.plugins.tooltip.intersect = false;
            Chart.defaults.plugins.tooltip.position = "nearest";
            Chart.defaults.plugins.tooltip.caretSize = 0;
            Chart.defaults.plugins.tooltip.caretPadding = 20;
            Chart.defaults.plugins.tooltip.cornerRadius = 4;
            Chart.defaults.plugins.tooltip.padding = 8;

            let words: { key: string, value: number }[] = Object.keys(metrics.technologies).reduce((acc: { key: string, value: number}[], value) => [...acc, { key: value, value: metrics.technologies[value]}], [])
            words = words.filter((d) => d.value > 1)
            words = words.sort((a, b) => b.value - a.value).slice(0, 100)
            words = words.map((d) => ({ key: d.key, value: d.value / 10 }))

            console.log(words)

            const ctx = <HTMLCanvasElement> document.getElementById("analytics-card-01");

            if (!(ctx === null || ctx === undefined)) {
                const chart = new Chart(
                    ctx, 
                    {
                        type: WordCloudController.id,
                        data: {
                            labels: words.map((d) => d.key),
                            datasets: [
                            {
                                label: "Cantidad de apariciones",
                                data: words.map((d) => 10 + d.value * 10),
                            },
                            ],
                        },
                        options: {
                            plugins: {
                                legend: {
                                    display: false,
                                },
                            },
                        },
                    });
            }
        }
    })
</script>

<section class="flex flex-col justify-center antialiased min-h-full m-2 mt-0">
    <div class="max-w-full mx-auto p-4 sm:px-6 h-full">
        <div class="card w-full bg-base-100 border border-base-300 shadow-xl">
            <header class="px-5 py-4 b flex flex-col md:flex-row items-center justify-between min-w-full">
                <h2 class="font-semibold text-xl">Analiticas para rol "Desarrollador web"</h2>
                <div class="flex mt-5 md:mt-0">
                    <button class="btn btn-primary m-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-filter"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                    </button>
                    <button class="btn btn-primary m-2">
                        Empresas
                    </button>
                    <button class="btn btn-primary m-2">
                        Seniority
                    </button>
                    <button class="btn btn-primary m-2">
                        Tecnologias
                    </button>
                </div>
            </header>
            <div class="px-5 py-1">
                <div class="flex flex-wrap">
                    <!-- Unique Visitors -->
                    <div class="flex items-center py-2">
                        <div class="mr-5">
                            <div class="flex items-center">
                                <h1 class="font-bold leading-10 text-2xl">{COPFormat.format(metrics.mean)}</h1>
                            </div>
                            <h1 class="font-regular leading-10 text-sm">Media salarial</h1>
                        </div>
                        <div class="hidden md:block w-px h-8  mr-5" aria-hidden="true"></div>
                    </div>
                    <!-- Total Pageviews -->
                    <div class="flex items-center py-2">
                        <div class="mr-5">
                            <div class="flex items-center">
                                <h1 class="font-bold leading-10 text-2xl">{COPFormat.format(metrics.std_dev)}</h1>
                            </div>
                            <h1 class="font-regular leading-10 text-sm">Desviacion estandar del salario</h1>
                        </div>
                        <div class="hidden md:block w-px h-8  mr-5" aria-hidden="true"></div>
                    </div>
                    <div class="flex items-center py-2">
                        <div class="mr-5">
                            <div class="flex items-center">
                                <h1 class="font-bold leading-10 text-2xl">{row_count}</h1>
                            </div>
                            <h1 class="font-regular leading-10 text-sm">Ofertas analizadas</h1>
                        </div>
                        <div class="hidden md:block w-px h-8  mr-5" aria-hidden="true"></div>
                    </div>
                </div>
            </div>
            <!-- Chart built with Chart.js 3 -->
            <div class="flex-grow">
                <canvas id="analytics-card-01" width="1500" height="600"></canvas>
            </div>
        </div>
    </div>
</section>
