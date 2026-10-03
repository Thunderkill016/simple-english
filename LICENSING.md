# Licensing

Simple English uses different licenses for different layers. This document is
the canonical statement of how licensing applies across the project.

## Layers

| Layer | License |
| --- | --- |
| SE source code | [MIT](LICENSE) |
| SE-authored documentation and specifications | [MIT](LICENSE) |
| Third-party educational content | Retains its original license (e.g., CC BY 4.0) |
| SE adaptations of third-party educational content | Governed by the original source license's terms (e.g., CC BY 4.0 attribution; share-alike where applicable) |
| "Simple English" name / branding | Not granted through MIT; all rights reserved |

## Rules

1. **The MIT license applies to SE's own work only.** It never relicenses
   third-party educational resources.
2. **Third-party educational content** keeps the license under which its
   authors published it, including all attribution and share-alike
   obligations. Each source's license is recorded in the source registry
   ([`docs/sources/`](docs/sources/README.md)).
3. **Adaptations** of third-party content inherit the obligations of the
   original license — for CC BY 4.0 sources that means attribution,
   a link to the license, and an indication of changes made.
4. **Free to access ≠ free to redistribute.** A source being readable online
   does not grant reuse rights; reuse requires the source's license to
   permit it.
5. **Branding is not licensed.** The MIT grant covers code and documentation;
   it does not grant rights to the "Simple English" name or marks.

## Why MIT for code

- Creative Commons explicitly recommends against CC licenses for software:
  CC licenses do not address source-code distribution or patent rights.
- MIT is the simplest widely understood OSI-approved permissive license; it
  maximizes reuse, consistent with SE's reuse-first philosophy.
- Apache-2.0 is the documented fallback if an explicit patent grant ever
  becomes necessary.
