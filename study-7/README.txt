RIVINGTON MARX — STUDY 07 / THE DIPTYCH

Desktop design study, designed at 1600 × 1000. No mobile version.
Open study-7/index.html (or the hub index.html one folder up).

WHAT IS IN THIS FOLDER
index.html      page markup
styles.css      all styling
script.js       data (projects, services, contact) and all interaction
vendor/         GSAP 3.12.5 + Observer, stored locally so the study works offline
Images are shared in ../assets/ (101 photos + 2 logo files). 22 of the photos are the
original files also used by Studies 1-6 (e.g. black-bath.jpg, foyer.jpg).

HOW IT BEHAVES
Home       One screen, no scroll. Two photographs from one project.
           Pairs change every 4 seconds (left first, right 350 ms later).
           Wheel, trackpad and arrow keys also change the pair.
           Moving the pointer over the photos holds the current pair and shows
           its name; it carries on once the pointer rests for 3 seconds.
           "Pause" stops autoplay entirely.
           Click a photo -> project window. Click the logo -> menu.
Project    Left half: images travel vertically (wheel, ↑ ↓, or click "Next").
           Right half: the companion image. Story + / Album / ← → / Close.
           Esc closes Story or Album first, then the window.
Work       Inset diptychs on a stone field, gentle vertical scroll. Index (top
           right) opens the list with a hover preview.
Services   Six panels; hover widens a panel. Click opens the service window.
Studio,
Contact    Overlays in the same two-half window. "Begin a project" opens a
           short form (the form does not send anything in this study).

TO CHANGE
Autoplay on/off ........ script.js, home section: AUTOPLAY seconds, or set
                         userPaused = true for "changes only when the visitor acts".
Project names, groups,
story text, credits .... script.js, PROJECTS list at the top.
Homepage order ......... script.js, FEATURED list.

PLACEHOLDERS TO CONFIRM WITH THE CLIENT
- Project names (except "Tailored in Stone") are working titles; photos were
  grouped by eye.
- Credits in [brackets] (architect, builder, photographer). Only Tailored in
  Stone has a confirmed photographer (Eric Lucero, from the file names).
- Story and service copy is draft copy describing the photographs.
- Contact details, team names and press titles are taken from rivingtonmarx.com.
