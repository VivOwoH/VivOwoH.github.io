---
layout: post
title: NVIDIA Jetson AGX Orin with OAI 5G Stack (WIP:12-Oct-2025)
date: 2025-10-1 11:00:00
description: Complete guide for configuring NVIDIA Jetson AGX Orin for 5G NR SA end-to-end setup with OpenAirInterface gNB
tags: nvidia jetson 5g oai embedded-systems
categories: tutorials
---

This guide covers the setup of NVIDIA Jetson AGX Orin with the OpenAirInterface (OAI) 5G stack, including custom kernel configuration with SCTP support.

## Overview

The setup includes:
- Force recovery mode configuration
- SCTP protocol support
- Docker container configuration
- 5G NR SA end-to-end setup with OAI gNB

## Setup Process

### Force Recovery Mode

To enter force recovery mode:

1. Power off the device
2. Press and hold the "force recovery" button while powering up
3. Verify recovery mode status

Check recovery status using the [NVIDIA documentation](https://docs.nvidia.com/jetson/archives/r36.3/DeveloperGuide/IN/QuickStart.html#to-flash-the-jetson-developer-kit-operating-software).

On my device:
- Normal mode: Bus 002 Device 004: ID 0955:7020 NVIDIA Corp. L4T (Linux for Tegra) running on Tegra
- Recovery mode: ID changes to 7023

### SCTP Support

Since `make prepare-system` likely asks for reboot before building/installing the kernel, it's easy to miss the kernel steps. Run these scripts separately:

```bash
./scripts/configure-system.sh
./scripts/build-custom-kernel.sh
./scripts/install-custom-kernel.sh
sudo reboot

# Probe and load SCTP (including dependencies)
sudo modprobe sctp

# Inspect SCTP module
modinfo sctp

# Verify SCTP is available
cat /proc/net/protocols | grep SCTP
```

### Docker Configuration

For Docker containers, modify `compose.yml` to use ARM64 compatible images:

```yaml
oaisoftwarealliance/[module]:[ARM64 version tags]
```

This step is only necessary if Docker images aren't found or the given version tags aren't compatible with your OS (ARM64). Check [OAI DockerHub](https://hub.docker.com/u/oaisoftwarealliance) for exact releases.

If issues arise, review commands in `start_system.sh` for troubleshooting.

### Other Important Notes

**Multiple Jetson Devices:**
- Cannot flash multiple Jetsons simultaneously
- Avoid connecting one host PC with multiple Jetsons while flashing

**Browser Issues on Jetson:**
If the browser doesn't open, it's likely a snapd issue:

```bash
sudo apt autoremove --purge snapd
sudo apt install snapd
sudo systemctl start snapd
sudo systemctl enable snapd
```

**Useful Docker Commands:**

```bash
docker ps -a                          # Show all running containers
docker compose down                   # Shut containers down
docker compose rmi [Image]           # Clean up cached image
docker compose restart [Image]       # Restart an unhealthy container
```

## 5G NR SA End-to-End Setup with OAI gNB

Following the [OAI tutorial](https://gitlab.eurecom.fr/oai/openairinterface5g/-/blob/develop/doc/NR_SA_Tutorial_OAI_nrUE.md#3-oai-gnb-and-oai-nrue), the openairinterface5g resources should already be in sionna-rk.

Modify `docker-compose.yml` as needed and check OAI DockerHub for releases.

### Installation Steps

```bash
cd ~/openairinterface5g
git checkout develop

# Install OAI dependencies
cd ~/openairinterface5g/cmake_targets
./build_oai -I

# Install nrscope dependencies
sudo apt install -y libforms-dev libforms-bin

# Build OAI gNB
cd ~/openairinterface5g/cmake_targets
./build_oai -w USRP --ninja --nrUE --gNB --build-lib "nrscope" -C

# Start core network containers
cd ~/openairinterface5g/doc/tutorial_resources/oai-cn5g
docker compose up -d

# Check container health
docker ps -a
```

The core network should be running at this point.



## Custom Kernel Configuration (SCTP Support) - deprecated

**Note:** Refer to the [Sionna RK kernel setup documentation](https://nvlabs.github.io/sionna/rk/setup/kernel.html#kernel) for the most current instructions.

### Background

The default Jetson kernel (NVIDIA L4T Release 36.3.0, based on JetPack 6.0) doesn't have SCTP (port 38412) enabled, which is required for the N2 interface between gNB and AMF:

```
[oai-gnb] ←------ N2 (SCTP) ------→ [oai-amf]
192.168.71.140                     192.168.71.132
```

Without SCTP support, you'll see errors like:

```
[2025-10-07 03:38:16.117] [sctp] [error] Socket: Protocol not supported:93
[2025-10-07 03:38:16.117] [ngap] [info] Set N2 AMF IPv4 Addr 192.168.71.132, port 38412
```

### Checking SCTP Support

```bash
# Check if SCTP is compiled (m=module, y=built-in)
zcat /proc/config.gz | grep SCTP

# If it exists as module and disabled, load it
sudo modprobe sctp

# Verify it's loaded
lsmod | grep sctp
```

### Building SCTP Into Kernel

**Important:** Do this before flashing for the first time!

#### Install Build Tools

```bash
sudo apt-get update
sudo apt-get install -y \
  flex \
  bison \
  build-essential \
  bc \
  libssl-dev \
  libncurses-dev \
  device-tree-compiler \
  python3 \
  git \
  wget \
  curl \
  libelf-dev

# For cross-compilation
sudo apt-get install -y gcc-aarch64-linux-gnu
```

#### Prepare Kernel Source

```bash
# Create working directory
mkdir jetson-flash && cd jetson-flash

# Download L4T packages
wget https://developer.nvidia.com/downloads/embedded/l4t/r36_release_v3.0/release/jetson_linux_r36.3.0_aarch64.tbz2
wget https://developer.nvidia.com/downloads/embedded/l4t/r36_release_v3.0/release/tegra_linux_sample-root-filesystem_r36.3.0_aarch64.tbz2

# Extract packages
tar xf jetson_linux_r36.3.0_aarch64.tbz2
sudo tar xpf tegra_linux_sample-root-filesystem_r36.3.0_aarch64.tbz2 -C Linux_for_Tegra/rootfs/

cd Linux_for_Tegra/

# Download kernel source
./source_sync.sh -k -t jetson_36.3
cd source/kernel/kernel-jammy-src/
```

#### Configure and Build Kernel

```bash
# Set environment
export CROSS_COMPILE=aarch64-linux-gnu-
export ARCH=arm64
export TEGRA_KERNEL_OUT=$(pwd)/kernel_out
mkdir -p $TEGRA_KERNEL_OUT

# Load default config
make ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- O=$TEGRA_KERNEL_OUT defconfig

# Open menuconfig to enable SCTP
make ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- O=$TEGRA_KERNEL_OUT menuconfig
```

In menuconfig, navigate to:
```
Networking support → Networking options → <M> The SCTP Protocol
```

Build the kernel:

```bash
make ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- O=$TEGRA_KERNEL_OUT -j$(nproc)

# Or use NVIDIA's build script
cd Linux_for_Tegra/
./source_sync.sh -k -t jetson_36.3
cd sources/kernel
./kernel_build.sh
```

The kernel image will be at `kernel_out/arch/arm64/boot/Image`.

#### Flash the Kernel

```bash
cd Linux_for_Tegra/

# Optional: Backup original kernel
sudo cp kernel/Image kernel/Image.backup

# Replace kernel image
sudo cp source/kernel/kernel-jammy-src/kernel_out/arch/arm64/boot/Image kernel/Image
sudo cp source/kernel/kernel-jammy-src/kernel_out/arch/arm64/boot/Image.gz kernel/Image.gz

# Apply NVIDIA binaries
sudo ./apply_binaries.sh

# Check module directories (should see 5.15.136-tegra)
ls -la rootfs/usr/lib/modules/

# Install custom kernel modules
sudo make -C source/kernel/kernel-jammy-src/ ARCH=arm64 \
  CROSS_COMPILE=aarch64-linux-gnu- O=kernel_out \
  INSTALL_MOD_PATH=$(pwd)/rootfs/ modules_install

# Verify new modules (should see 5.15.136+ now)
ls -la rootfs/usr/lib/modules/

# Reapply binaries
sudo ./apply_binaries.sh

# Flash to NVMe
sudo ./tools/kernel_flash/l4t_initrd_flash.sh --external-device nvme0n1p1 \
  -c tools/kernel_flash/flash_l4t_t234_nvme.xml \
  --showlogs --network usb0 jetson-agx-orin-devkit external
```

### Workaround for Missing Subdirectories

During flashing, some subdirectories may be missing in the customized kernel modules. Here's a workaround:

```bash
# Navigate to modules directory
cd rootfs/usr/lib/modules/

# Check what exists in tegra kernel
ls -la 5.15.136-tegra/updates/

# Copy the entire updates directory
sudo cp -r 5.15.136-tegra/updates/ 5.15.136+/ 2>/dev/null || true

# Verify it exists
ls -la 5.15.136+/updates/drivers/spi/
```

---

After completing these steps, your Jetson AGX Orin should be ready to run the OAI 5G stack with full SCTP support.