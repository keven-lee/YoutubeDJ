Youtube DJ
========

A YouTube playlist builder with simple UI. App created with JavaScript, AngularJS, and Youtube's API to search videos by term.

## Purpose

Usually at parties or other social gatherings, YouTube is the medium of choice for playing music. 
People often: 

* open a new tab
* browse to YouTube
* search for a video
* open and pause the video to preload (for those with slower internet connections)
* wait for the current video to stop
* launch a new video

This creates many problems for users:

* waiting for the current video to stop before linking to a new video
* a need to designate someone as a DJ to queue and launch videos
* a lack of continuous playing music since there is no music after the current video ends
* clunky native Youtube UI for queuing videos
* several opened tabs of Youtube

## Features

Youtube DJ is an attempt to create a smoother and simplistic user experience as a solution to those issues.

* Single page mobile friendly app
* Ajax search
* The ability to customize your own playlists on the go
* Automatic playing of videos
* Simple interface, with viewable history
* NO ADS!!!

## Possible enhancements

* Play/Pause/Next/Previous buttons, since only the state of a current video is shown in this version
* Create a show more results functionality as the user scrolls down the list of returned search results
* Allow the saving of a playlist in LocalStorage or a cookie and restore it on the next visit
* Add a `Clear Playlist` button
* Add draggable gestures to reorder the playlist items
