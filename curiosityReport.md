# Curiosity Report - Containers: Inside and Beyond

## What are Containers?

A way to package software in a standard way to easily and quickly deploy on different computing environments. The software is packaged with all its dependencies so that it will run the same on any computing environment. Basically, containers are meant to reduce the toil that comes from trying to ship software from one location to another, like from the location its developed and tested on to the location it runs on in production, or from one dev location to another dev location. Before containers, this was difficult to automate consistently, and difficult to ensure that the software would reliably run the same on multiple computers with different operating systems.

## What are Docker Containers?

Containers that run on Docker engine specifically. There are also other container technologies besides Docker like Podman, Kubernetes, and Containerd among others. Docker originated the standard container format idea, however, and helped containers explode into popularity within the tech world. The Docker engine is one of the most common engines for creating containers, and DockerHub holds some of the largest registries for container images.

## How does it work?

Through the linux kernel and namespacing which allows processes to divide resources between users and compartmentalize better. Docker built upon namespaces, cgroups and other features that allow isolation to create containers that package up an entire application in its own little sandbox that is isolated from other processes.

## But how does the linux kernel do that? And what are namespaces?

Namespaces are an abstraction layer running inside the kernel. They expose kernel functions to processes "pretending" they are running in their own kernel, but they are all sharing the same kernel in the underlying host for all the processes. To me, this kind of seems like if you and your roommate share a kitchen, but were on completely opposite schedules so you both effectively function in isolation without ever affecting the other roommate. In that anology, it seems like the namespace is the one cleaning up after each of you and ensuring that you never cross paths in the kitchen at the same time. There are multiple kernel namespaces, at least 7, that each expose their own different part of the kernel (like the mount point seen by the process, or the users and group ID space). When we create a container, the container engine (like Docker!) talks with the kernel namespaces to get a new space in each namespace where the container will run. From the host OS point of view the container looks like a simple process, to process it looks like a new dedicated OS even though its not.

## You mentioned cgroups, what's that?

Cgroups were added to the Linux kernel in 2008. They are meant to primarily support controlling and limiting resources for collections of processes. This basically means that it protects against one process using all of the resources available and leaving none for the other processes. So for example, if you and your roommate were processes and the WiFi in your apartment was the resource, the cgroup would stop your roommate from torrenting and consuming all of the bandwidth and leaving none for you to do your curiosity report CS project. This is an important step in making containers possible.

## So what about container orchestration?

Container orchestration is all about how to get all of those containers working together when they're being scheduled for creation at different times and across different machines. For example, you might have a database in one container, your web server in another container, and redundant backups spun up in other containers.

Kubernetes and Docker Swarm were both designed as solutions for that issue. Initially Kubernetes was created by some developers at Google as an open source orchestration platform built on top of Docker containers, and when it was announced in 2014 there were several other companies trying to create the next big orchestration platform and build on the rise of Docker. This led to some competition as each technology struggled to push itself to the top. Eventually, Kubernetes came out on top as the leading orchestration platform, partially due to the large amount of community support that it received and the eventual announcement in 2017 that Docker would built integration with Kubernetes into its platform. As Kubernetes grew from its beginnings with a small team of developers from Google and a few other companies, it was eventually changed to be managed by the newly created non profit organization Cloud Native Computing Foundation

### Resources

https://www.cncf.io/blog/2019/06/24/demystifying-containers-part-i-kernel-space/

https://gcore.com/learning/what-is-a-container-a-kernel-introduction

https://www.youtube.com/watch?v=3N3n9FzebAA
