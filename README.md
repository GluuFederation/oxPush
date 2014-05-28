oxPush
======
<p>oxPush is an open source mobile two-factor authentication application that can be deployed on Android, iOS, Windows and Blackberry mobile platforms. oxPush is an Apache Cordova project, and is a single html5 page that can be customized to present a very specific user experience for mobile two-factor authentication.</p>
<p>To access Gluu support, please register and open a ticket on <a href="http://support.gluu.org" target="none">Gluu Support</a>
<h2><a name="table-of-contents" class="anchor" href="#table-of-contents"><span class="octicon octicon-link"></span></a>Table of contents</h2>
<ul>
<li><a href="#server-deployment">Server Deployment</a></li>
<li><a href="#authors">Authors</a></li>
<li><a href="#copyright-and-license">Copyright and license</a></li>
</ul>
<h2><a name="quick-start" class="anchor" href="#server-deployment"><span class="octicon octicon-link"></span></a>Server Deployment</h2>
<p>These are the main instructions for configuring the oxPushServer, oxPush and related applications and software.</p>
<h3>Directory Structure</h3>
<p>This is typical directory structure for oxPush applications:</p>
<div class="highlight highlight-bash"><pre><span class="c">/opt
/opt/oxpush           // Top level folder for oxPush applications
/opt/oxpush/mobile    // Directory with binaries for Adroid, iOS, Windows Phone, etc...
/opt/oxpush/server    // Directory for oxPushServer
</pre></div>
<p>Apache group and user should have access to '/opt/oxpush' folder and sub-folders.</p>
<h3>Apache Server Configuration</h3>
<p>This installation process assumes that Apache will be used to host binaries for mobile devices. This part of configuration based on offered directory structure.</p>
<div class="highlight highlight-bash"><pre><span class="c">Alias /static/oxpush /opt/oxpush/mobile

<Directory /opt/oxpush/mobile>
    # directives to effect the static directory
    Options +Indexes
</Directory>

ProxyPass /static !

### oxPush
ProxyPass        /oxpush http://seed.gluu.org:3000/oxpush/
ProxyPassReverse /oxpush http://seed.gluu.org:3000/oxpush/

RewriteRule ^/oxpush(.*)$  http://seed.gluu.org:3000/oxpush$1 [P,L]
</pre></div>
<p>These settings can be used for SSL port too.</p>
<h3>Node.js and Cordova installation</h3>
<p>There are only few steps needed to install Node.js</p>
<div class="highlight highlight-bash"><pre><span class="c">cd /opt
wget http://nodejs.org/dist/v0.10.22/node-v0.10.22-linux-x64.tar.gz
tar -xzf node-v0.10.22-linux-x64.tar.gz
ln -s /opt/node-v0.10.22-linux-x64 ./node
rm -f node-v0.10.22-linux-x64.tar.gz
</pre></div>
<p>In order to use the 'node' and 'npm' command without specifying the full path we need to update ~/.bashrc file. We need to add next lines:</p>
<div class="highlight highlight-bash"><pre><span class="c">PATH=$PATH:/opt/node/bin
export PATH
</pre></div>
<p>After re-login we are able to run 'node' and 'npm' commands.</p>
<p>Also you can execute the following command to apply changes to current session:</p>
<div class="highlight highlight-bash"><pre><span class="c">source /root/.bashrc
</pre></div>
<p>Npm repository contains only source code without binaries. Hence npm installer build some npm modules during installation for specific platform.</p>
<p>Npm isn't compatible with latest python version. Also there are few system dependencies. On CentOS 5.8 x64 we need to install next packages:</p>
<div class="highlight highlight-bash"><pre><span class="c">yum install python26.x86_64 make gcc-c++
</pre></div>
<p>This document contains more information about dependencies requirerd to build native modules: <a href="https://github.com/TooTallNate/node-gyp">node-gyp</a>.</p>
<p>On CentOS 5.8 there is no package 'python26.x86_64' in repository. It's in epel repository. These 2 commands help to install this repository:</p>
<div class="highlight highlight-bash"><pre><span class="c">wget http://dl.fedoraproject.org/pub/epel/5/x86_64/epel-release-5-4.noarch.rpm
rpm -Uvh epel-release-5*.rpm
</pre></div>
<p>After installing python we also need to export PYTHON variable or configure system to use this version of python by default:</p>
<div class="highlight highlight-bash"><pre><span class="c">export PYTHON=/usr/bin/python26
</pre></div>
<h3>Cordova Installation</h3>
<p>We need to install Node.js in order to install Cordova. Here is the command to install cordova:</p>
<div class="highlight highlight-bash"><pre><span class="c">npm install -g cordova
</pre></div>
<p>The installation log may produce errors for any uninstalled platform SDKs. There is more information about Cordova in the official documentation's <a href="http://cordova.apache.org/docs/en/edge/guide_cli_index.md.html#The%20Command-Line%20Interface">prerequisites section</a>.</p>
<p>If you are planning to build a mobile application you also need to install SDK tools for the specific platform. Cordova contains a <a href="http://cordova.apache.org/docs/en/edge/guide_platforms_index.md.html#Platform%20Guides">platform guides</a> section with detailed information about platform dependencies.</p>
<h3>Configuring oxPush server</h3>
<p>The following commands provide the base configuration to start the oxPushServer:</p>
<div class="highlight highlight-bash"><pre><span class="c">cd /opt/oxpush
rm -rf server
svn export https://svn.gluu.info/repository/openxdi/oxPush/server
cd server
npm install
mkdir log
chown tomcat.tomcat log
cd bin
</pre></div>
<p>Set the correct variable values in oxPushStartupVariables.sh.</p>
<p>Now we can try to run oxPushServer:</p>
<div class="highlight highlight-bash"><pre><span class="c">su -c ./start.sh -s /bin/sh tomcat &> ../log/oxpush.log &
</pre></div>
<p>In next release we are planning to use superagent to run and stop oxPushServer. Now we need to use kill command to stop node process.</p>
<h3>Configuring oxAuth custom authentication module for oxPush</h3>
<p>oxPush custom authentication script is based on oxAuth plugin architecture. This modules is standart one. In order to add and enable it we can use oxTrust GUI. In order to do that we need to do:</p>
<ol>
<li>Log into oxTrust using user with administrative privileges.</li>
<li>Open “Configuration”→“Organization Configuration”.</li>
<li>Click “Add custom authentication configuration”.</li>
<li>Specify “oxpush” in “Name field.</li>
<li>Paste script to “Script” field.</li>
<li>Add new property “oxpush_server_base_uri” with URL of oxPushServer. Example: “http://localhost:3000/oxpush”.</li>
<li>Add new property “oxpush_application_name” with name of register application. Example: “gluu_test”.</li>
<li>Add new property “oxpush_user_timeout”. Example: 60.</li>
<li>Add new property “oxpush_android_download_url” with URL which user can use to download Android mobile application. Example: ”../../../static/oxpush/oxPush.apk”.</li>
<li>Click “Enabled”.</li>
<li>Specify proper “Level” and “Priority”</li>
<li>Click “Update” button</li>
<li>In drop down box “Authentication mode” select “oxpush”</li>
<li>Click “Update” button</li>
</ol>
<p>Now we can try to log in using oxPush two-factor authentication. Please make sure that the server reloaded the custom login configuration. It will usually do that within 1 minute.</p>
<h2><a name="quick-start" class="anchor" href="#authors"><span class="octicon octicon-link"></span></a>Authors</h2>
<p><strong>Yuriy Movchan</strong></p>

<ul>
<li><a href="http://github.com/mdo">https://github.com/yurem</a></li>
</ul>
<h2><a name="copyright-and-license" class="anchor" href="#copyright-and-license"><span class="octicon octicon-link"></span></a>Copyright and license</h2>

<p>Code and documentation copyright 2009-2014 Gluu, Inc. Code and Docs released under <a href="https://github.com/GluuFederation/OX/blob/master/LICENSE">the MIT license</a>.</p>


