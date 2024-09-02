type QueryParams = Record<string, string>;

const backend = {
    config: {
        url: 'https://localhost:8080/api/v1/'
    },
    construct: function(endpoint: string, queryParams: QueryParams = {}): string {
        const url = new URL(this.config.url + endpoint);
        Object.keys(queryParams).forEach(key => url.searchParams.append(key, queryParams[key]));
        console.log("requested construction of: " + url.toString());
        return url.toString();
    }
}

export default backend;