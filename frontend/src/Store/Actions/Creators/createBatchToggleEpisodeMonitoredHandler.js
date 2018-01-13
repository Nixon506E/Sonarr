import $ from 'jquery';
import updateEpisodes from 'Utilities/Episode/updateEpisodes';
import getSectionState from 'Utilities/State/getSectionState';

function createBatchToggleEpisodeMonitoredHandler(section) {
  return function(payload) {
    return function(dispatch, getState) {
      const {
        episodeIds,
        monitored
      } = payload;

      const state = getSectionState(getState(), section, true);

      updateEpisodes(dispatch, section, state.items, episodeIds, {
        isSaving: true
      });

      const promise = $.ajax({
        url: '/episode/monitor',
        method: 'PUT',
        data: JSON.stringify({ episodeIds, monitored }),
        dataType: 'json'
      });

      promise.done(() => {
        updateEpisodes(dispatch, section, state.items, episodeIds, {
          isSaving: false,
          monitored
        });
      });

      promise.fail(() => {
        updateEpisodes(dispatch, section, state.items, episodeIds, {
          isSaving: false
        });
      });
    };
  };
}

export default createBatchToggleEpisodeMonitoredHandler;
