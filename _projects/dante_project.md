---
layout: page
title: Networked Device Management w/ Digital Twin
description: Digital twin system for offline device management in distributed networks
img: assets/img/project/digital_twin_thumbnail.jpg
importance: 2
category: project
related_publications: false
---

## Overview

This project explored configuration and management of networked audio systems via GraphQL API. The system implemented digital twin and digital shadow concepts to enable two key features: configuring offline devices with pending changes, and restoring devices to previous configuration states.
  
**Tech Stack**: GraphQL API, TypeScript, Digital Twin Architecture

---

## Problem #1: Managing Offline Devices

Users couldn't view or edit devices when they went offline, losing visibility into their network state.

### Solution: Digital Shadows & Pending Actions

- **Digital Shadow**: Maintained last known state of offline devices
- **Pending Actions**: Stored configuration changes as queued operations
- **Digital Twin**: Simulated forward-projected state by composing shadow + pending actions

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/project/network_offline.png" title="offline device warning" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Warning shown for offline devices. Pending changes can be previewed and undone before device comes online.
</div>

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/project/network_pending.png" title="pending changes interface" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Device state after applying pending changes can be previewed with a digital twin of the device.
</div>

<div class="row">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/project/network_online.png" title="online device" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    When devices reconnect, pending changes are automatically applied to synchronize the physical device with the desired state.
</div>

---

## Problem #2: Configuration History & Restore

Users needed the ability to restore devices to previous configurations, similar to version control for network states.

### Solution: Decomposition & Timestamped States

- **Historic States**: Timestamped snapshots of device configurations stored as domain shadows
- **Decomposition**: Algorithm to calculate required deltas between current and desired states
- **Selective Restore**: Users can choose which configuration changes to apply

The system decomposes the difference between current state and target historic state into pending actions, which are then applied when devices are online.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/project/history_state.png" title="history states list" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Historic states showing applicable changes for each restoration point.
</div>

---

## Architecture

The system operates on a data flow between physical devices, digital shadows, and pending actions:

**Composition** (Problem #1):
- Shadow (last known state) + Pending Actions (deltas) → Simulated Twin (desired state)
- Shows users what the device will look like after pending changes apply

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/project/composition.png" title="composition" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

**Decomposition** (Problem #2):
- Desired State - Shadow (current state) → Deltas → Pending Actions
- Calculates what changes are needed to reach historic state

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/project/decomposition.png" title="decomposition" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

### Key Concepts

- **Digital Twin**: Bidirectional automatic data flow with physical device
- **Digital Shadow**: Unidirectional reflection of physical device state
- **Pending Actions**: Queued configuration changes stored as deltas
- **Cached Actions**: Successfully applied changes (for optimization)

---

## Technical Highlights

### Data Validation
- Pre-runtime configuration validation using flagged properties
- Applicability checks for offline subscribed devices

### Persistent & Runtime Storage
- Domain shadows (JSON documents with device states at various timestamps)
- Pending actions (unapplied user changes)
- Cached actions (successfully registered changes)

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/project/persistent_storage.png" title="persistent" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

### Optimistic Locking
Implemented timestamp-based enforcement to ensure users restore from most recent state.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/project/optimistic_locking.png" title="optimisitic lock" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

---

## Outstanding Challenges

**Bulk Error Handling**: Deltas of the same type are processed together; an error in one subscription affects the entire batch.

**Race Conditions**: Concurrent requests may cause state inconsistencies between decomposition and action application (e.g. the state of physical devices has changed, during the time gap between decomposition and sending pending actions).



---

## Future Work

- **Performance optimization** using cached actions for repeated decompositions

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/project/optimization.png" title="optimization" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

- **Expand action types** beyond subscriptions (currently only channel subscriptions implemented)
- **Enhanced validation** with more comprehensive pre-runtime configuration checks


---

## Impact

This project enabled network management users to:
- Maintain network visibility even when devices are offline
- Make configuration changes to offline devices that apply on reconnection
- Roll back to previous configurations like version control for audio networks
- Preview simulated states before changes take effect

The digital twin architecture provides a declarative approach to network management, separating desired state from current state and automating synchronization.