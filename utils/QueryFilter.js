class QueryFilter {
  constructor(queryString, filter) {
    this.queryString = queryString && queryString.trim();
    this.queryItems = this.queryString ? queryString.split(",") : [];
    this.filter = filter;
  }

  applyTo(refs) {
    if (this.queryItems.length === 0) return refs;
    let newRefs = [];
    this.queryItems.forEach(item => {
      if (item.trim().length > 0) refs.forEach(ref => newRefs.push(this.filter(ref, item)));
    });
    return newRefs;
  }
}

module.exports = QueryFilter;