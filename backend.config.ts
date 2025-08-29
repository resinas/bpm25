type QueryParams = Record<string, string>;

const backend = {
    config: {
        url: 'https://conftest.bpm2025seville.org/api/v1/'
    },
    construct: function(endpoint: string, queryParams: QueryParams = {}): string {
        const url = new URL(this.config.url + endpoint);
        Object.keys(queryParams).forEach(key => url.searchParams.append(key, queryParams[key]));
        return url.toString();
    }
}

export default backend;