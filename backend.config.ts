type QueryParams = Record<string, string>;

const backend = {
    config: {
        url: 'https://icpm-app-backend.azurewebsites.net/api/v1/'
        // url: 'https://localhost:8080/api/v1/'
    },
    construct: function(endpoint: string, queryParams: QueryParams = {}): string {
        const url = new URL(this.config.url + endpoint);
        Object.keys(queryParams).forEach(key => url.searchParams.append(key, queryParams[key]));
        return url.toString();
    }
}

export default backend;