/* SignalDesk Mini — US-003 Insights filter action */
(function () {
  'use strict';

  window.actFilterInsights = function () {
    const menu = document.getElementById('insights-filter-menu');
    if (menu) menu.classList.toggle('hidden');
  };

  window.actApplyInsightsFilter = function (value) {
    if (typeof window.renderInsightsMini === 'function') {
      window.renderInsightsMini(value);
    }
    window.actFilterInsights();
  };
})();
