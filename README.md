# README #

This README would normally document whatever steps are necessary to get your application up and running.

## What is this repository for? ##

### Quick summary ###


See Vision and Scope. (TODO: add link)


* Version(s)
* Repository Structure
    * WMT Web Client Application
    * WMT REST Server Application 

## How do I get set up? ##
See Software Architecture Document (TODO: add wiki link).

* Summary of set up
    * Install NetBeans IDE Enterprise Edition (includes web servers)
        * Download: 
    * Install Tomcat web server (may be included in NetBeans EE)
        * Download: 
    * Clone this repository
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
                * Safari > Preferences > Advanced | Show Develop menu [checked]
                * Safari > Develop > Enable WebGL [checked]
* Deployment instructions
    * Tomcat Deployment
        1. Open Tomcat Web Application Manager (TODO: add link http://emxsys.azurewebsites.net/manager/html)
        1. Undeploy existing web app.
        1. Browse to .war file
        1. Deploy
    * Microsoft WebMatrix (TODO)
        1. Copy .war to local site's bin/apache-tomcat-<version>/webapps
        1. Upload to remote site
    
## Contribution guidelines ##
See Software Development Plan (TODO: add wiki link).

* Overview
* Writing tests
* Code review
* Other guidelines
    * See Design and Coding Guidelines (TODO: add wiki link)

## Who do I talk to? ##

* Repo owner or admin
* Other community or team contact