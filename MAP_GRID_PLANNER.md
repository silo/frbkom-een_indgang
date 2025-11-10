# Map grid planner
Custom vue 3 component for visual event planning with drag-and-drop functionality on static image backgrounds.

- Based on dropdown selection of location, the corresponding static image is loaded as background.
- Users can drag-and-drop artifacts (stages, booths, facilities) onto the grid planner. ( freely no grid snapping )
- Artifacts are represented as icons/badges that can be moved, resized, and rotated
- Artifacts can be removed or edited
  - Editing includes changing size, rotation, and type of artifact where there is icons on each corner of the artifact for these actions
- An artifact on the map is a black box with opacity of 30% with an icon in the middle representing the type of artifact. Right upper corner is rotation handle, bottom right is resize handle, left upper corner is a info buttom that opens a modal box with more details about the artifact (type, size, rotation in degrees, position coordinates) and remove button
- The planner have a sidebar with list of available artifacts that can be dragged onto the planner area
