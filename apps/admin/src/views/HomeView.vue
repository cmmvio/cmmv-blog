<template>
  <div class="space-y-6">
    <!-- Dashboard Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-white">Dashboard</h1>
      <div>
                <button
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200">
          New Post
        </button>
      </div>
    </div>

    <!-- Stats Overview Cards - 2 per row on medium screens -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-neutral-800 rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-neutral-400 text-sm">Total Posts</p>
                        <h2 class="text-2xl font-bold text-white mt-1">{{ summary.posts || 0 }}</h2>
          </div>
          <div class="bg-blue-600/20 p-3 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
                    <span class="text-green-500 flex items-center" v-if="summary.postsGrowth > 0">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
            </svg>
                        {{ summary.postsGrowth }}%
                    </span>
                    <span class="text-red-500 flex items-center" v-else-if="summary.postsGrowth < 0">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                        {{ Math.abs(summary.postsGrowth) }}%
                    </span>
                    <span class="text-neutral-400 flex items-center" v-else>
                        0%
          </span>
          <span class="text-neutral-400 ml-2">from last month</span>
        </div>
      </div>

      <div class="bg-neutral-800 rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-neutral-400 text-sm">Comments</p>
                        <h2 class="text-2xl font-bold text-white mt-1">{{ summary.comments || 0 }}</h2>
          </div>
          <div class="bg-purple-600/20 p-3 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
                    <span class="text-green-500 flex items-center" v-if="summary.commentsGrowth > 0">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                        </svg>
                        {{ summary.commentsGrowth }}%
                    </span>
                    <span class="text-red-500 flex items-center" v-else-if="summary.commentsGrowth < 0">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
                        {{ Math.abs(summary.commentsGrowth) }}%
                    </span>
                    <span class="text-neutral-400 flex items-center" v-else>
                        0%
          </span>
          <span class="text-neutral-400 ml-2">from last month</span>
        </div>
      </div>

      <div class="bg-neutral-800 rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-neutral-400 text-sm">Total Views</p>
                        <h2 class="text-2xl font-bold text-white mt-1">{{ formatNumber(summary.views || 0) }}</h2>
          </div>
          <div class="bg-green-600/20 p-3 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
                    <span class="text-green-500 flex items-center" v-if="summary.viewsGrowth > 0">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
            </svg>
                        {{ summary.viewsGrowth }}%
                    </span>
                    <span class="text-red-500 flex items-center" v-else-if="summary.viewsGrowth < 0">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                        {{ Math.abs(summary.viewsGrowth) }}%
                    </span>
                    <span class="text-neutral-400 flex items-center" v-else>
                        0%
          </span>
          <span class="text-neutral-400 ml-2">from last month</span>
        </div>
      </div>

      <div class="bg-neutral-800 rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-neutral-400 text-sm">New Subscribers</p>
                        <h2 class="text-2xl font-bold text-white mt-1">{{ summary.subscribers || 0 }}</h2>
          </div>
          <div class="bg-amber-600/20 p-3 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
                    <span class="text-green-500 flex items-center" v-if="summary.subscribersGrowth > 0">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
            </svg>
                        {{ summary.subscribersGrowth }}%
                    </span>
                    <span class="text-red-500 flex items-center" v-else-if="summary.subscribersGrowth < 0">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                        {{ Math.abs(summary.subscribersGrowth) }}%
                    </span>
                    <span class="text-neutral-400 flex items-center" v-else>
                        0%
          </span>
          <span class="text-neutral-400 ml-2">from last month</span>
        </div>
      </div>
    </div>

    <!-- Full-width content sections -->
    <div class="space-y-6">
            <!-- Traffic Overview Chart - now full width -->
            <div class="bg-neutral-800 rounded-lg shadow-md">
                <div class="p-6 border-b border-neutral-700">
                    <h3 class="text-lg font-medium text-white">Traffic Overview</h3>
                </div>
                <div class="p-6">
                    <div class="h-72 bg-neutral-800 rounded-md">
                        <canvas ref="trafficChart" class="w-full h-full"></canvas>
                    </div>
                    <div class="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                            <p class="text-sm text-neutral-400">Total Visitors</p>
                            <p class="text-xl font-semibold text-white">{{ formatNumber(summary.totalVisitors || 0) }}
                            </p>
                        </div>
                        <div>
                            <p class="text-sm text-neutral-400">Unique Visitors</p>
                            <p class="text-xl font-semibold text-white">{{ formatNumber(summary.uniqueVisitors || 0) }}
                            </p>
                        </div>
                        <div>
                            <p class="text-sm text-neutral-400">Bounce Rate</p>
                            <p class="text-xl font-semibold text-white">{{ summary.bounceRate || 0 }}%</p>
                        </div>
                        <div>
                            <p class="text-sm text-neutral-400">Avg. Time</p>
                            <p class="text-xl font-semibold text-white">{{ formatTime(summary.avgTime || 0) }}</p>
                        </div>
                    </div>
                </div>
            </div>

      <!-- Popular Posts - now full width -->
      <div class="bg-neutral-800 rounded-lg shadow-md">
        <div class="p-6 border-b border-neutral-700">
          <h3 class="text-lg font-medium text-white">Most Popular Posts This Week</h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div v-for="post in popularPosts" :key="post.id" class="flex items-start gap-4">
              <div class="flex-shrink-0 h-16 w-24 bg-neutral-700 rounded-md overflow-hidden">
                                <img v-if="post.image" :src="post.image"
                                    class="h-full w-full object-cover" :alt="post.title">
                                <div v-else class="h-full w-full bg-gradient-to-br from-neutral-600 to-neutral-700">
              </div>
              </div>
              <div class="flex-1 min-w-0">
                                <h4 class="text-base font-medium text-white truncate">{{ post.title }}</h4>
                <div class="flex items-center mt-1">
                                    <span class="text-neutral-400 text-sm">Published on {{ formatDate(post.publishedAt)
                                        }}</span>
                </div>
                <div class="flex items-center mt-2 text-sm">
                  <div class="flex items-center text-neutral-400 mr-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                                        {{ formatNumber(post.views || 0) }}
                  </div>
                  <div class="flex items-center text-neutral-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                                        {{ post.comments || 0 }}
                  </div>
                </div>
              </div>
                            <div class="flex-shrink-0 self-center" v-if="post.mainTag">
                                <span
                                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {{ post.mainTag }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-neutral-700">
                    <a href="/posts" class="text-blue-500 hover:text-blue-400 text-sm font-medium">View all posts →</a>
        </div>
      </div>

      <!-- Comments Needing Approval - moved below Most Popular Posts -->
      <div class="bg-neutral-800 rounded-lg shadow-md">
        <div class="p-6 border-b border-neutral-700 flex justify-between items-center">
          <h3 class="text-lg font-medium text-white">Comments Needing Approval</h3>
                    <span class="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">{{
                        summary.pendingComments || 0 }} New</span>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 bg-neutral-700/50 rounded-lg">
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 rounded-full bg-neutral-600"></div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-1">
                    <p class="text-sm font-medium text-white">Sarah Johnson</p>
                  </div>
                                    <p class="text-sm text-neutral-300 line-clamp-2">This is a great article! I've
                                        implemented some of these SEO tips and my traffic has already improved...</p>
                                    <div class="mt-1 text-xs text-neutral-400">On: 10 Ways to Improve Your Blog's SEO...
                                    </div>
                  <div class="flex gap-1 mt-2">
                                        <button
                                            class="px-2 py-0.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded">Approve</button>
                                        <button
                                            class="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded">Reject</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-4 bg-neutral-700/50 rounded-lg">
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 rounded-full bg-neutral-600"></div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-1">
                    <p class="text-sm font-medium text-white">Michael Chen</p>
                  </div>
                                    <p class="text-sm text-neutral-300 line-clamp-2">Have you considered writing about
                                        the impact of AI on content marketing? That would be a fascinating...</p>
                                    <div class="mt-1 text-xs text-neutral-400">On: The Ultimate Guide to Content...
                                    </div>
                  <div class="flex gap-1 mt-2">
                                        <button
                                            class="px-2 py-0.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded">Approve</button>
                                        <button
                                            class="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded">Reject</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-4 bg-neutral-700/50 rounded-lg">
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 rounded-full bg-neutral-600"></div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-1">
                    <p class="text-sm font-medium text-white">Emily Rodriguez</p>
                  </div>
                                    <p class="text-sm text-neutral-300 line-clamp-2">I've been following your blog for
                                        years and the community you've built is truly inspiring. The tips...</p>
                                    <div class="mt-1 text-xs text-neutral-400">On: How to Build a Loyal Community...
                                    </div>
                  <div class="flex gap-1 mt-2">
                                        <button
                                            class="px-2 py-0.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded">Approve</button>
                                        <button
                                            class="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded">Reject</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-neutral-700">
                    <a href="/comments" class="text-blue-500 hover:text-blue-400 text-sm font-medium">View all pending comments
                        →</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';

// Import analytics service
import { useAdminClient } from '@cmmv/blog/admin';

const adminAPI = useAdminClient();
const analytics = adminAPI.analytics;

// Reference for the chart canvas
const trafficChart = ref(null);
let chart = null;

// State for analytics data
const summary = ref({
    posts: 0,
    postsGrowth: 0,
    comments: 0,
    commentsGrowth: 0,
    views: 0,
    viewsGrowth: 0,
    subscribers: 0,
    subscribersGrowth: 0,
    pendingComments: 0,
    totalVisitors: 0,
    uniqueVisitors: 0,
    bounceRate: 0,
    avgTime: 0,
    trafficData: []
});

const popularPosts = ref([]);

// Create traffic chart
const createTrafficChart = () => {
    if (!trafficChart.value) return;

    const ctx = trafficChart.value.getContext('2d');

    // Destroy existing chart if it exists
    if (chart) {
        chart.destroy();
    }

    // Use the traffic data directly from the summary object
    const trafficData = summary.value.trafficData || [];

    if (trafficData.length > 0) {
        // Sort data by date
        trafficData.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Extract the dates, total access and unique access
        const labels = trafficData.map(item => {
            const date = new Date(item.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });

        const visitorData = trafficData.map(item => item.uniqueAccess || 0);
        const pageViewData = trafficData.map(item => item.totalAccess || 0);

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Unique Visitors',
                        data: visitorData,
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 1,
                        pointRadius: 4,
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Page Views',
                        data: pageViewData,
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderColor: 'rgba(16, 185, 129, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 1,
                        pointRadius: 4,
                        tension: 0.3,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: {
                                family: 'system-ui'
                            },
                            boxWidth: 12,
                            padding: 15
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(30, 41, 59, 0.9)',
                        titleColor: 'rgba(255, 255, 255, 0.9)',
                        bodyColor: 'rgba(255, 255, 255, 0.7)',
                        borderColor: 'rgba(71, 85, 105, 0.5)',
                        borderWidth: 1,
                        padding: 10,
                        displayColors: true,
                        boxWidth: 8,
                        boxHeight: 8,
                        titleFont: {
                            family: 'system-ui',
                            weight: 'bold',
                            size: 13
                        },
                        bodyFont: {
                            family: 'system-ui',
                            size: 12
                        },
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += formatNumber(context.parsed.y);
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(71, 85, 105, 0.2)',
                            drawBorder: false
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.6)',
                            font: {
                                family: 'system-ui',
                                size: 11
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(71, 85, 105, 0.2)',
                            drawBorder: false
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.6)',
                            font: {
                                family: 'system-ui',
                                size: 11
                            },
                            callback: function(value) {
                                return formatNumber(value);
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                hover: {
                    mode: 'index',
                    intersect: false
                }
            }
        });
    } else {
        // No data available, show empty chart with a message
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['No Data Available'],
                datasets: [
                    {
                        data: [0],
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                },
                scales: {
                    x: {
                        display: true,
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        display: false,
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
};

// Fetch data on component mount
onMounted(async () => {
    try {
        // Get dashboard data
        const dashboardData = await analytics.getDashboard();
        console.log('Dashboard data:', dashboardData);

        // Get analytics summary for the traffic chart
        const summaryData = await analytics.getSummary();
        console.log('Summary data:', summaryData);

        if (dashboardData) {
            // Calculate growth percentages
            // For posts and comments, use the values provided by the API
            const postsGrowth = dashboardData.postsFromLastMonth > 0
                ? Math.round(((dashboardData.totalPosts - dashboardData.postsFromLastMonth) / dashboardData.postsFromLastMonth) * 100)
                : 0;

            const commentsGrowth = dashboardData.commentsFromLastMonth > 0
                ? Math.round(((dashboardData.totalComments - dashboardData.commentsFromLastMonth) / dashboardData.commentsFromLastMonth) * 100)
                : 0;

            // For views and subscribers, calculate based on historical data if available
            let viewsGrowth = 0;
            let subscribersGrowth = 0;

            // If the API provides values for last month's views and subscribers
            if (dashboardData.accessFromLastMonth !== undefined) {
                viewsGrowth = dashboardData.accessFromLastMonth > 0
                    ? Math.round(((dashboardData.totalAccess - dashboardData.accessFromLastMonth) / dashboardData.accessFromLastMonth) * 100)
                    : 0;
            }

            if (dashboardData.membersFromLastMonth !== undefined) {
                subscribersGrowth = dashboardData.membersFromLastMonth > 0
                    ? Math.round(((dashboardData.totalMembers - dashboardData.membersFromLastMonth) / dashboardData.membersFromLastMonth) * 100)
                    : 0;
            }

            // Store the traffic data
            const trafficData = summaryData?.trafficData || summaryData || [];

            // Calculate metrics not provided by the dashboard API
            if (Array.isArray(trafficData) && trafficData.length > 0) {
                // Calculate average bounce rate
                const bounceRate = Math.round(
                    trafficData.reduce((sum, item, index, array) => {
                        return sum + (item.bounceRate || 0) * (item.totalAccess || 1) /
                            array.reduce((total, i) => total + (i.totalAccess || 1), 0);
                    }, 0)
                );

                // Calculate weighted average time on page
                const avgTime = Math.round(
                    trafficData.reduce((sum, item, index, array) => {
                        return sum + (item.avgTimeOnPage || 0) * (item.totalAccess || 1) /
                            array.reduce((total, i) => total + (i.totalAccess || 1), 0);
                    }, 0)
                );

                // Update the summary with both dashboard and calculated values
                summary.value = {
                    // Dashboard API values
                    posts: dashboardData.totalPosts || 0,
                    postsGrowth: postsGrowth,
                    comments: dashboardData.totalComments || 0,
                    commentsGrowth: commentsGrowth,
                    views: dashboardData.totalAccess || 0,
                    viewsGrowth: viewsGrowth,
                    subscribers: dashboardData.totalMembers || 0,
                    subscribersGrowth: subscribersGrowth,
                    totalVisitors: dashboardData.totalAccess || 0,
                    uniqueVisitors: dashboardData.uniqueAccess || 0,

                    // Values from traffic data
                    bounceRate: bounceRate,
                    avgTime: avgTime,
                    trafficData: trafficData,

                    // Other values
                    pendingComments: summaryData?.pendingComments || 0,
                };
            } else {
                // If no traffic data, just use the dashboard data
                summary.value = {
                    posts: dashboardData.totalPosts || 0,
                    postsGrowth: postsGrowth,
                    comments: dashboardData.totalComments || 0,
                    commentsGrowth: commentsGrowth,
                    views: dashboardData.totalAccess || 0,
                    viewsGrowth: viewsGrowth,
                    subscribers: dashboardData.totalMembers || 0,
                    subscribersGrowth: subscribersGrowth,
                    totalVisitors: dashboardData.totalAccess || 0,
                    uniqueVisitors: dashboardData.uniqueAccess || 0,
                    pendingComments: summaryData?.pendingComments || 0,
                    bounceRate: 0,
                    avgTime: 0,
                    trafficData: []
                };
            }
        }

        // Get most accessed posts
        const postsData = await analytics.getPostsMostAccessed();
        console.log('Most accessed posts:', postsData);

        if (postsData) {
            popularPosts.value = postsData;
        }

        // Create the traffic chart after data is loaded
        createTrafficChart();
    } catch (error) {
        console.error('Error fetching analytics data:', error);
    }
});

// Helper functions for formatting
const formatNumber = (num) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
};

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
};
</script>
