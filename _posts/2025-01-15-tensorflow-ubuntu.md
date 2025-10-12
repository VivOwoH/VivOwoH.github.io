---
layout: post
title: TensorFlow-GPU on Ubuntu with CUDA 11.8
date: 2025-01-15 10:00:00
description: A comprehensive guide for installing TensorFlow with GPU support on WSL2 and Ubuntu 22.04, including CUDA 11.8 and cuDNN 8 configuration
tags: tensorflow gpu cuda ubuntu machine-learning
categories: tutorials
---

This guide walks through installing TensorFlow 2.14.0 with GPU support on WSL2 or Ubuntu 22.04 LTS, using CUDA 11.8 and cuDNN 8.

## Version Requirements

- **WSL2 or Ubuntu 22.04 LTS** (Ubuntu 20.04 also compatible)
- **NVIDIA driver** (version 520.61.05 tested)
- **Python 3.11+** (affects available TensorFlow versions)
- **TensorFlow 2.14.0** (any version >=2.10.1 works with Sionna)
- **CUDA 11.8**
- **cuDNN 8**

**Important:** If you're following TensorFlow's official "Install TensorFlow with pip" guide, disregard it and follow this document instead for proper CUDA/cuDNN configuration.

## Installation Steps

### 1. WSL2 / Ubuntu 22.04 Setup

Download Ubuntu 22.04 LTS from the [Microsoft Store](https://www.microsoft.com/store/productId/9PN20MSR04DW?ocid=pdpshare), or follow Microsoft's [WSL installation guide](https://learn.microsoft.com/en-us/windows/wsl/install).

**Note:** Ubuntu 20.04 also works, but remember to change version numbers to `2004` when downloading CUDA and cuDNN in later sections.

### 2. Python 3.11 Installation

Install Python 3.11:

```bash
sudo apt install python3.11
```

For TensorFlow versions other than 2.14.0, refer to the [TensorFlow compatibility table](https://www.tensorflow.org/install/source) for required Python versions.

### 3. NVIDIA Driver Installation

#### Pre-Installation

```bash
echo blacklist nouveau | sudo tee -a /etc/modprobe.d/nouveau-kms.conf
echo options nouveau modeset=0 | sudo tee -a /etc/modprobe.d/nouveau-kms.conf
sudo update-initramfs -u
sudo reboot

# Register driver for kernel changes using dkms
sudo apt-get install dkms
```

#### Quick Installation (Updated January 2025)

Tested on Ubuntu 22.04/20.04. Choose a version compatible with your kernel:

```bash
wget https://us.download.nvidia.com/tesla/520.61.05/NVIDIA-Linux-x86_64-520.61.05.run
sudo sh NVIDIA-Linux-x86_64-520.61.05.run --dkms
```

Alternatively, download the driver from [NVIDIA's website](https://www.nvidia.com/download/index.aspx) based on your GPU (check Task Manager → Performance to identify your graphics card).

#### Verify Installation

```bash
nvidia-smi
dkms status
```

**Note:** `nvidia-smi` shows the highest CUDA version your driver supports, not the installed CUDA version.

### 4. CUDA 11.8 Installation

#### Quick Installation (Updated January 2025)

Run the CUDA toolkit installer. **Deselect the NVIDIA 520.61.05 driver option** in the menu:

```bash
wget https://developer.download.nvidia.com/compute/cuda/11.8.0/local_installers/cuda_11.8.0_520.61.05_linux.run
sudo sh cuda_11.8.0_520.61.05_linux.run
```

#### Alternative Method

If the commands above don't work, see Appendix A for the repository-based installation:

```bash
# Change 2204 to 2004 for Ubuntu 20.04
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-ubuntu2204.pin
sudo mv cuda-ubuntu2204.pin /etc/apt/preferences.d/cuda-repository-pin-600

wget https://developer.download.nvidia.com/compute/cuda/11.8.0/local_installers/cuda-repo-ubuntu2204-11-8-local_11.8.0-520.61.05-1_amd64.deb
sudo dpkg -i cuda-repo-ubuntu2204-11-8-local_11.8.0-520.61.05-1_amd64.deb
sudo cp /var/cuda-repo-ubuntu2204-11-8-local/cuda-*-keyring.gpg /usr/share/keyrings/

sudo apt-get update
sudo apt-get -y install cuda
```

#### Post-Installation

Add these paths to `~/.bashrc`:

```bash
export PATH=/usr/local/cuda-11.8/bin:$PATH
export LD_LIBRARY_PATH=/usr/local/cuda-11.8/lib64:$LD_LIBRARY_PATH

# Verify paths
echo $PATH
sudo ldconfig
```

### 5. cuDNN 8 Installation

#### Archive Installation (Updated January 2025)

Using cuDNN 8.7.0:

```bash
CUDNN_TAR_FILE="cudnn-linux-x86_64-8.7.0.84_cuda11-archive.tar.xz"
sudo wget https://developer.download.nvidia.com/compute/redist/cudnn/v8.7.0/local_installers/11.8/cudnn-linux-x86_64-8.7.0.84_cuda11-archive.tar.xz
sudo tar -xvf ${CUDNN_TAR_FILE}
sudo mv cudnn-linux-x86_64-8.7.0.84_cuda11-archive cuda
```

#### Alternative Method

```bash
sudo apt-get update
sudo apt-get install libcudnn8
sudo apt-get install libcudnn8-dev
```

#### Post-Installation

```bash
sudo cp -P cuda/include/cudnn.h /usr/local/cuda-11.8/include
sudo cp -P cuda/lib/libcudnn* /usr/local/cuda-11.8/lib64/
sudo chmod a+r /usr/local/cuda-11.8/lib64/libcudnn*
```

### 6. TensorFlow Installation

Install TensorFlow (any version >=2.10.1 is compatible with Sionna, but verify CUDA compatibility):

```bash
pip3 install tensorflow==2.14.0

# Test GPU detection
python -c "import tensorflow as tf; print(tf.config.list_physical_devices('GPU'))"
```

## Appendix

### A. Alternative CUDA and cuDNN Installation

Add NVIDIA CUDA repository to Ubuntu:

```bash
# Change 2204 to 2004 for Ubuntu 20.04
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-ubuntu2204.pin
sudo mv cuda-ubuntu2204.pin /etc/apt/preferences.d/cuda-repository-pin-600

sudo apt-key adv --fetch-keys https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/3bf863cc.pub
sudo add-apt-repository "deb https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/ /"

# Install specific versions
sudo apt-get install libcudnn8=${cudnn_version}-1+${cuda_version}
sudo apt-get install libcudnn8-dev=${cudnn_version}-1+${cuda_version}

# Example for CUDA 11.8 and cuDNN 8.9.7
sudo apt-get install libcudnn8=8.9.7.29-1+cuda11.8
sudo apt-get install libcudnn8-dev=8.9.7.29-1+cuda11.8
```

The public key `3bf863cc.pub` is the fastest method. If it doesn't work, follow [NVIDIA's key rotation guide](https://forums.developer.nvidia.com/t/notice-cuda-linux-repository-key-rotation/212772).

### B. TensorFlow Official Guide Issues

If following TensorFlow's "Install TensorFlow with pip" guide, note these inconsistencies:

- The cuDNN SDK 8.6.0 link redirects to the latest version. For consistency, follow the cuDNN section in this guide to download cuDNN 8.
- The command `python3 -m pip install tensorflow[and-cuda]` downloads CUDA 12. For consistency, follow the CUDA section to download CUDA 11.8.

---

This setup provides a stable environment for running TensorFlow with GPU acceleration on Ubuntu systems.