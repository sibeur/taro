function formatSizeUnits(kb) {
    if (kb >= 1073741824) {
      kb = (kb / 1073741824).toFixed(2) + ' TB';
    } else if (kb >= 1048576) {
      kb = (kb / 1048576).toFixed(2) + ' GB';
    } else if (kb >= 1024) {
      kb = (kb / 1024).toFixed(2) + ' MB';
    } else if (kb > 1) {
      kb = kb + ' KB';
    } else {
      kb = '0 byte';
    }
    return kb;
}
const mediaShowUI = Vue.createApp({
    data() {
      return {
        commitedMedia,
        uncommitedMedia,
        stats: mediaStats,
        isCommitedMediaLoading: false,
        isUnCommitedMediaLoading: false,
        isStatsLoading: false
      };
    },
    computed: {
        commitedPercentageStats() {
            if(!this.stats.commited) return 0
            return (this.stats.commited / this.stats.total) * 100
        },
        uncommitedPercentageStats() {
            if(!this.stats.uncommited) return 0
            return (this.stats.uncommited / this.stats.total) * 100
        },
        commitedStats() {
            if(!this.stats.commited) return ''
            return formatSizeUnits(this.stats.commited)
        },
        uncommitedStats() {
            if(!this.stats.uncommited) return ''
            return formatSizeUnits(this.stats.uncommited)
        },
        totalStats() {
            if(!this.stats.total) return ''
            return formatSizeUnits(this.stats.total)
        }
    },
    methods: {
        async loadStats () {
            try {
                this.isStatsLoading = true
                const url = `${media_api_url}/media/${ruleData.name}/storage-stats`;
                const res = await fetch(url, {
                    method: 'GET',
                    headers: {
                    version: '1',
                    Authorization: `Basic ${token}`,
                    'Content-Type': 'application/json',
                    },
                });
                const dataJSON = await res.json();
                if (!res.ok) throw dataJSON;
                this.stats = dataJSON.data
                this.isStatsLoading = false
                return;
            } catch (error) {
                const { message } = error;
                alert(message);
                this.isStatsLoading = false
                return;
            }
        },
        async loadUnCommitedMedia(page = 1) {
            try {
                this.isUnCommitedMediaLoading = true
                const url = `${media_api_url}/media?filter[rule.id]=${ruleData.id}&filter[commit]=false&select=aliasName,size,mime,ext,url&page=${page}&limit=25`;
                const res = await fetch(url, {
                    method: 'GET',
                    headers: {
                    version: '1',
                    Authorization: `Basic ${token}`,
                    'Content-Type': 'application/json',
                    },
                });
                const dataJSON = await res.json();
                if (!res.ok) throw dataJSON;
                this.uncommitedMedia = dataJSON.data.results
                this.isUnCommitedMediaLoading = false
                return;
            } catch (error) {
                const { message } = error;
                alert(message);
                this.isUnCommitedMediaLoading = false;
                return;
            }
        },
        async loadCommitedMedia(page = 1) {
            try {
                this.isCommitedMediaLoading = true
                const url = `${media_api_url}/media?filter[rule.id]=${ruleData.id}&filter[commit]=true&select=aliasName,size,mime,ext,url&page=${page}&limit=25`;
                const res = await fetch(url, {
                    method: 'GET',
                    headers: {
                    version: '1',
                    Authorization: `Basic ${token}`,
                    'Content-Type': 'application/json',
                    },
                });
                const dataJSON = await res.json();
                if (!res.ok) throw dataJSON;
                this.commitedMedia = dataJSON.data.results
                this.isCommitedMediaLoading = false
                return;
            } catch (error) {
                const { message } = error;
                alert(message);
                this.isCommitedMediaLoading = false
                return;
            }
        },
        async commitMedia(id) {
            try {
              const body = {
                mediaIds: [id],
              };
              const url = `${media_api_url}/media/commit`;
              const res = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                  version: '1',
                  Authorization: `Basic ${token}`,
                  'Content-Type': 'application/json',
                },
              });
              const dataJSON = await res.json();
              if (!res.ok) throw dataJSON;
              await Promise.all([
                  this.loadCommitedMedia(),
                  this.loadUnCommitedMedia()
              ])
              await this.loadStats()
              return;
            } catch (error) {
              const { message } = error;
              alert(message);
              return;
            }
        },
        async dropMedia(id) {
            try {
              const body = {
                mediaIds: [id],
              };
              const url = `${media_api_url}/media/drop`;
              const res = await fetch(url, {
                method: 'DELETE',
                body: JSON.stringify(body),
                headers: {
                  version: '1',
                  Authorization: `Basic ${token}`,
                  'Content-Type': 'application/json',
                },
              });
              const dataJSON = await res.json();
              if (!res.ok) throw dataJSON;
              await Promise.all([
                this.loadCommitedMedia(),
                this.loadUnCommitedMedia()
              ])
              await this.loadStats()
              return;
            } catch (error) {
              const { message } = error;
              alert(message);
              return;
            }
        },
        async cleanMedia() {
            const opt = confirm(
              'This action will clean older uncommited media. Sure want to clean it?',
            );
            if (!opt) return;
            try {
              const url = `${media_api_url}/media/clean`;
              const res = await fetch(url, {
                method: 'DELETE',
                headers: {
                  version: '1',
                  Authorization: `Basic ${token}`,
                  'Content-Type': 'application/json',
                },
              });
              const dataJSON = await res.json();
              if (!res.ok) throw dataJSON;
              await Promise.all([
                this.loadUnCommitedMedia(),
                this.loadStats()
              ])
              return;
            } catch (error) {
              const { message } = error;
              alert(message);
              return;
            }
          }
    },
  }).mount('#taro-media-show');
  