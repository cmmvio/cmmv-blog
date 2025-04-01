<template>
  <div class="space-y-6">
    <!-- Dashboard Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-white">Dashboard</h1>
      <div>
        <button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200">
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
            <h2 class="text-2xl font-bold text-white mt-1">42</h2>
          </div>
          <div class="bg-blue-600/20 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-green-500 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
            </svg>
            12%
          </span>
          <span class="text-neutral-400 ml-2">from last month</span>
        </div>
      </div>

      <div class="bg-neutral-800 rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-neutral-400 text-sm">Comments</p>
            <h2 class="text-2xl font-bold text-white mt-1">138</h2>
          </div>
          <div class="bg-purple-600/20 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-red-500 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
            3%
          </span>
          <span class="text-neutral-400 ml-2">from last month</span>
        </div>
      </div>

      <div class="bg-neutral-800 rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-neutral-400 text-sm">Total Views</p>
            <h2 class="text-2xl font-bold text-white mt-1">28.5k</h2>
          </div>
          <div class="bg-green-600/20 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-green-500 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
            </svg>
            18%
          </span>
          <span class="text-neutral-400 ml-2">from last month</span>
        </div>
      </div>

      <div class="bg-neutral-800 rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-neutral-400 text-sm">New Subscribers</p>
            <h2 class="text-2xl font-bold text-white mt-1">156</h2>
          </div>
          <div class="bg-amber-600/20 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-green-500 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
            </svg>
            24%
          </span>
          <span class="text-neutral-400 ml-2">from last month</span>
        </div>
      </div>
    </div>

    <!-- Full-width content sections -->
    <div class="space-y-6">
      <!-- Popular Posts - now full width -->
      <div class="bg-neutral-800 rounded-lg shadow-md">
        <div class="p-6 border-b border-neutral-700">
          <h3 class="text-lg font-medium text-white">Most Popular Posts This Week</h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 h-16 w-24 bg-neutral-700 rounded-md overflow-hidden">
                <div class="h-full w-full bg-gradient-to-br from-neutral-600 to-neutral-700"></div>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-base font-medium text-white truncate">10 Ways to Improve Your Blog's SEO Ranking</h4>
                <div class="flex items-center mt-1">
                  <span class="text-neutral-400 text-sm">Published on May 12, 2023</span>
                </div>
                <div class="flex items-center mt-2 text-sm">
                  <div class="flex items-center text-neutral-400 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    8.2k
                  </div>
                  <div class="flex items-center text-neutral-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    42
                  </div>
                </div>
              </div>
              <div class="flex-shrink-0 self-center">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  SEO
                </span>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 h-16 w-24 bg-neutral-700 rounded-md overflow-hidden">
                <div class="h-full w-full bg-gradient-to-br from-neutral-600 to-neutral-700"></div>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-base font-medium text-white truncate">The Ultimate Guide to Content Marketing in 2023</h4>
                <div class="flex items-center mt-1">
                  <span class="text-neutral-400 text-sm">Published on May 8, 2023</span>
                </div>
                <div class="flex items-center mt-2 text-sm">
                  <div class="flex items-center text-neutral-400 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    7.4k
                  </div>
                  <div class="flex items-center text-neutral-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    36
                  </div>
                </div>
              </div>
              <div class="flex-shrink-0 self-center">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Marketing
                </span>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 h-16 w-24 bg-neutral-700 rounded-md overflow-hidden">
                <div class="h-full w-full bg-gradient-to-br from-neutral-600 to-neutral-700"></div>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-base font-medium text-white truncate">How to Build a Loyal Community Around Your Blog</h4>
                <div class="flex items-center mt-1">
                  <span class="text-neutral-400 text-sm">Published on May 5, 2023</span>
                </div>
                <div class="flex items-center mt-2 text-sm">
                  <div class="flex items-center text-neutral-400 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    6.8k
                  </div>
                  <div class="flex items-center text-neutral-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    29
                  </div>
                </div>
              </div>
              <div class="flex-shrink-0 self-center">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Community
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-neutral-700">
          <a href="#" class="text-blue-500 hover:text-blue-400 text-sm font-medium">View all posts →</a>
        </div>
      </div>

      <!-- Comments Needing Approval - moved below Most Popular Posts -->
      <div class="bg-neutral-800 rounded-lg shadow-md">
        <div class="p-6 border-b border-neutral-700 flex justify-between items-center">
          <h3 class="text-lg font-medium text-white">Comments Needing Approval</h3>
          <span class="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">7 New</span>
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
                  <p class="text-sm text-neutral-300 line-clamp-2">This is a great article! I've implemented some of these SEO tips and my traffic has already improved...</p>
                  <div class="mt-1 text-xs text-neutral-400">On: 10 Ways to Improve Your Blog's SEO...</div>
                  <div class="flex gap-1 mt-2">
                    <button class="px-2 py-0.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded">Approve</button>
                    <button class="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded">Reject</button>
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
                  <p class="text-sm text-neutral-300 line-clamp-2">Have you considered writing about the impact of AI on content marketing? That would be a fascinating...</p>
                  <div class="mt-1 text-xs text-neutral-400">On: The Ultimate Guide to Content...</div>
                  <div class="flex gap-1 mt-2">
                    <button class="px-2 py-0.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded">Approve</button>
                    <button class="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded">Reject</button>
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
                  <p class="text-sm text-neutral-300 line-clamp-2">I've been following your blog for years and the community you've built is truly inspiring. The tips...</p>
                  <div class="mt-1 text-xs text-neutral-400">On: How to Build a Loyal Community...</div>
                  <div class="flex gap-1 mt-2">
                    <button class="px-2 py-0.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded">Approve</button>
                    <button class="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded">Reject</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-neutral-700">
          <a href="#" class="text-blue-500 hover:text-blue-400 text-sm font-medium">View all pending comments →</a>
        </div>
      </div>

      <!-- Traffic Overview Chart - now full width -->
      <div class="bg-neutral-800 rounded-lg shadow-md">
        <div class="p-6 border-b border-neutral-700">
          <h3 class="text-lg font-medium text-white">Traffic Overview</h3>
        </div>
        <div class="p-6">
          <div class="h-72 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-md flex items-center justify-center">
            <p class="text-neutral-400">Chart Visualization (Mock)</p>
          </div>
          <div class="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p class="text-sm text-neutral-400">Total Visitors</p>
              <p class="text-xl font-semibold text-white">24,521</p>
            </div>
            <div>
              <p class="text-sm text-neutral-400">Unique Visitors</p>
              <p class="text-xl font-semibold text-white">18,348</p>
            </div>
            <div>
              <p class="text-sm text-neutral-400">Bounce Rate</p>
              <p class="text-xl font-semibold text-white">42.3%</p>
            </div>
            <div>
              <p class="text-sm text-neutral-400">Avg. Time</p>
              <p class="text-xl font-semibold text-white">3m 24s</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Tasks -->
      <div class="bg-neutral-800 rounded-lg shadow-md">
        <div class="p-6 border-b border-neutral-700">
          <h3 class="text-lg font-medium text-white">Quick Tasks</h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
            <a href="#" class="flex items-center p-3 hover:bg-neutral-700 rounded-md transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span class="text-neutral-200">Write new post</span>
            </a>

            <a href="#" class="flex items-center p-3 hover:bg-neutral-700 rounded-md transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="text-neutral-200">Schedule content</span>
            </a>

            <a href="#" class="flex items-center p-3 hover:bg-neutral-700 rounded-md transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span class="text-neutral-200">Upload media</span>
            </a>

            <a href="#" class="flex items-center p-3 hover:bg-neutral-700 rounded-md transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span class="text-neutral-200">View analytics</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// This is a mock dashboard, no actual data fetching needed yet
</script>
