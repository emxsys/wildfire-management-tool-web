# README - Wildfire Management Tool Web (WMTweb) #

## What is this repository for? ##

This repository is used to build the WMT Web Application and the WMT REST Server.
The REST server is a Java project comprised of several NetBeans modules. 
The web application is a JavaScript project.
All of the projects are managed by Maven.

For more information, see the [Wiki Home](https://bitbucket.org/emxsys/wildfire-management-tool-web/wiki/Home).

### Overview ###

* Version(s): 1.0.0
#### Repository Structure
 Module                    | Description 
-------------------------- | -------------------------------------------------
***wmt-application-web***  | ***WMT Web Application***
***wmt-application-rest*** | ***WMT REST Server Application*** 
wmt-gis                    | WMT GIS API module [REST Server]
wmt-jfree                  | JFree Charts wrapper module
wmt-libraries              | Wrapper module for third party libraries [REST Server]
wmt-solar                  | WMT Solar API module [REST Server]
wmt-time                   | WMT Time API module [REST Server]
wmt-utilties               | WMT Utilities module [REST Server]
wmt-visad                  | VisAD wrapper module [REST Server]
wmt-weather                | WMT Weather API module [REST Server]
wmt-weather-mesowest       | WMT MesoWest Weather Service Provider module [REST Server]
wmt-weather-nws            | WMT National Weather Service Provider module [REST Server]
wmt-wildfire               | WMT Wildfire API [REST Server]
vpproject                  | Visual Paradigm UML project

## How do I get set up? ##
Refer to the following documents for insight into the structure and design of this project:

See the [Software Architecture Document](https://bitbucket.org/emxsys/wildfire-management-tool-web/wiki/Software%20Architecture)

See the [Software Design Guidelines](https://bitbucket.org/emxsys/wildfire-management-tool-web/wiki/Software%20Design)

* Summary of set up
    * Install NetBeans IDE Enterprise Edition (includes web servers)
        * Download: 
    * Install Tomcat web server (may be included in NetBeans EE)
        * Download: 
    * Clone this repository to your local drive
    * Open and build the **wildfire-management-tool-web** project
        * NetBeans: File > Open Project 
* Configuration
    * Optional: Add an Apache Tomcat server to NetBeans
        * NetBeans: Tools > Servers > <Add Server...>
    * Configure **WMT Application - REST Services** project to use your web server
        * NetBeans: Projects tab > **WMT Application - REST Services** > Properties | Run
* Dependencies: Project dependencies are managed automatically by Maven. 
* Database configuration: None.
* How to run tests
    * Unit tests: Automatically performed by Maven
    * Run time tests
        * Run **WMT Application - REST Services**
            * The web server should start automatically. If necessary: NetBeans: Services > Servers > <Server Name> | Start
            * The REST Server page should be displayed in your web browser
        * Run **WMT Application - Web** project
            * The WMT web application should be displayed in your web browser
            * Safari prerequisites: You must enable WebGL
                * Safari > Preferences > Advanced | Show Develop menu = checked
                * Safari > Develop > Enable WebGL = checked
* Deployment instructions: Two methods are described
    * Apache Tomcat Deployment
        1. Open your Tomcat Web Application Manager
        1. Undeploy existing web app.
        1. Browse to .war file
        1. Deploy
    * Microsoft WebMatrix
        1. Copy .war to local site's bin/apache-tomcat-<version>/webapps
        1. Upload to remote site
    
## Contribution guidelines ##
Contact the repository owner regarding access to the repository or to submit changes.
Also suggest enhancements and bug fixes via the [Issue Tracker](https://bitbucket.org/emxsys/wildfire-management-tool-web/issues)

## Who do I talk to? ##
* Bruce Schubert: bruce at emxsys dot com

## Project metrics
* See the [Wildfire-Management-Tool-Web project on OpenHub](https://www.openhub.net/p/wildfire-management-tool-web)