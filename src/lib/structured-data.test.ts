import { describe, expect, it } from 'vitest';
import { content } from './content';
import { structuredData } from './structured-data';

describe('structuredData', () => {
  it('describes the site and the person, linking their profiles', () => {
    const graph = structuredData['@graph'];
    expect(graph.map((n) => n['@type']).sort()).toEqual(['Person', 'WebSite']);
    const person = graph.find((n) => n['@type'] === 'Person');
    expect(person).toMatchObject({
      name: content.site.name,
      sameAs: [content.site.links.github, content.site.links.linkedin],
    });
  });
});
