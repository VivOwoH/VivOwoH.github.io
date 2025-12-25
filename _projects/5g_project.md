---
layout: page
title: End-to-End Wireless Communication with Channel Surrogate
description: Neural network-based communication system using CWGAN for differentiable channel modeling
img: assets/img/project/e2e_system.png
importance: 1
category: research
related_publications: false
---

## Overview

This research developed an end-to-end (E2E) learning system for wireless communication where transmitter and receiver are replaced with jointly optimized neural networks. The main innovation is using a conditional Wasserstein GAN (CWGAN) as a differentiable channel surrogate to enable gradient computation when the physical channel is non-differentiable or unknown.

*The code repository is private due to institutional rules. Drop me an email if you want source code access.*

**Tech Stack**: Neural Networks, GANs, OFDM, 5G NR Wireless, 3GPP, TensorFlow  

---

## The Challenge: E2E Non-Differentiability

Traditional wireless systems use independently optimized modules (mapper, channel estimator, equalizer, demapper). E2E learning with neural networks can achieve 15-20% spectral efficiency improvement, but faces a fundamental challenge: **gradient backpropagation requires a differentiable channel**.

### Mathematical Formalization

For E2E training, we need gradients at both receiver and transmitter:

**Receiver gradient (always computable):**

$$\frac{\partial R}{\partial \mathbf{w}_{rx}} = \frac{\partial R}{\partial \mathbf{LLR}_d} \frac{\partial \mathbf{LLR}_d}{\partial \mathbf{Y}_{d,r}} \frac{\partial \mathbf{Y}_d}{\partial \mathbf{w}_{rx}}$$

**Transmitter gradient (requires differentiable channel):**

$$\frac{\partial R}{\partial \mathbf{w}_{tx,u}} = \frac{\partial R}{\partial \mathbf{LLR}_d} \frac{\partial \mathbf{LLR}_d}{\partial \mathbf{Y}_{d,r}} \frac{\partial \mathbf{Y}_{d,c}}{\partial \mathbf{X}_{d,c}} \frac{\partial \mathbf{X}_{d,r}}{\partial \mathbf{w}_{tx,u}}$$

The critical term $$\frac{\partial \mathbf{Y}_{d,c}}{\partial \mathbf{X}_{d,c}}$$ is the **channel Jacobian matrix**. This cannot be computed when:
1. Channel is non-differentiable (discontinuous operations break chain rule)
2. Channel is unknown (no mathematical model available)

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/project/e2e_system.png" title="E2E system architecture" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    End-to-end system with neural mapper, OFDM channel, and neural receiver (DeepRx).
</div>

---

## Solution: CWGAN Channel Surrogate

We employ a conditional Wasserstein GAN to learn a differentiable surrogate of the wireless channel from real-world measurements.

### CWGAN Architecture

**Generator** learns to produce fake received signals:

$$\mathbf{Y}_{fake} = G(\mathbf{z} | \mathbf{X}_{rg}, \mathbf{c})$$

where:
- $$\mathbf{z} \sim \mathcal{N}(0,1)$$ is random noise
- $$\mathbf{X}_{rg}$$ is transmitted resource grid (base conditioning)
- $$\mathbf{c}$$ is contextual channel information

**Discriminator** distinguishes real from fake samples:

$$D(\mathbf{Y} | \mathbf{X}_{rg}, \mathbf{c}) \rightarrow \mathbb{R}$$

### Wasserstein Loss Functions

**Generator loss** (minimize):

$$\mathcal{L}_G = \mathbb{E}_{\mathbf{Y}_{fake} \sim P(\mathbf{Y}_{fake})}[-D(\mathbf{Y}_{fake}|\mathbf{X}_{rg}, \mathbf{c})]$$

**Discriminator loss** (maximize):

$$\mathcal{L}_D = \mathbb{E}_{\mathbf{Y}_{fake}}[D(\mathbf{Y}_{fake}|\mathbf{X}_{rg}, \mathbf{c})] - \mathbb{E}_{\mathbf{Y}_{rg}}[D(\mathbf{Y}_{rg}|\mathbf{X}_{rg}, \mathbf{c})]$$
$$+ \lambda \mathbb{E}_{\hat{\mathbf{Y}}} \left[ \left( \|\nabla_{\hat{\mathbf{Y}}} D(\hat{\mathbf{Y}}|\mathbf{X}_{rg}, \mathbf{c})\|_2 - 1 \right)^2 \right]$$

where $$\hat{\mathbf{Y}} \leftarrow \epsilon \mathbf{Y}_{rg} + (1-\epsilon)\mathbf{Y}_{fake}$$ with $$\epsilon \sim \mathcal{U}[0,1]$$

The gradient penalty term enforces the 1-Lipschitz constraint, preventing training instability and mode collapse.

---

## System Components

### Neural Mapper (Transmitter)

Learns optimal constellation points through gradient-based optimization rather than using fixed modulation schemes (e.g., 64-QAM).

**Trainable constellation** $$\mathcal{S} = \{s_{n,1}, s_{n,2}, \ldots, s_{n,2^k}\}$$ with energy normalization:

$$s_{n,i} = \frac{s_i}{\sqrt{\frac{1}{2^k}\sum_{i=1}^{2^k}|s_i|^2}}, \quad i = 1, 2, \ldots, 2^k$$

Maps coded bits $$\mathbf{u}$$ to symbols $$\mathbf{x} = f_{tx}(\mathbf{w}_{tx}, \mathbf{u})$$

### OFDM Channel

Resource grid transmission with frequency response:

$$\mathbf{Y}_{rg} = f_{ch}(\mathbf{X}_{rg}) = \mathbf{H} \odot \mathbf{X}_{rg} + \mathbf{W}$$

Can be decomposed into data and pilot components:

$$\mathbf{Y}_{rg} = (\mathbf{H} \odot \mathbf{X}_d + \mathbf{W}_d) + (\mathbf{H} \odot \mathbf{X}_p + \mathbf{W}_p) = \mathbf{Y}_d + \mathbf{Y}_p$$

### Neural Receiver (DeepRx)

Jointly optimizes channel estimator, equalizer, and demapper in a unified neural network:

$$\mathbf{LLR}_d = f_{rx,\mathbf{w}_{rx}}(\mathbf{Y}_d, \hat{\mathbf{H}}_{raw}, \mathbf{X}_p)$$

Inputs: received resource grid, pilot channel estimates, known pilots  
Output: Log-likelihood ratios for LDPC decoding

### Loss Function: BMD Rate

System maximizes bit-metric decoding (BMD) rate:

$$R = 1 - \frac{1}{N_c} \sum_{i=1}^{N_c} \text{BCE}(u_i, p_i)$$

where $$p_i = \sigma(\text{LLR}_{d,i})$$ converts LLRs to bit probabilities

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/project/cwgan_train.png" title="CWGAN-E2E training process" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Two-phase training: (1) CWGAN pre-training with fixed constellation, (2) Joint E2E training with alternating optimization.
</div>

---

## Training Methodology

### Phase 1: CWGAN Pre-training

Neural mapper fixed to standard 64-QAM constellation. CWGAN learns channel distribution with consistent transmitted symbols until generator and discriminator converge.

### Phase 2: Joint E2E Training

Alternating optimization between three components:

1. **CWGAN fine-tuning** (every 10 iterations): Generator and discriminator adapt to evolving constellation
2. **Neural mapper training**: Updates constellation $$\mathcal{S}$$ using fake channel $$\mathbf{Y}_{fake}$$ from generator
3. **Neural receiver training**: Updates receiver weights using real channel $$\mathbf{Y}_{rg}$$

This approach ensures the channel surrogate remains accurate as the constellation adapts.

---

## Key Research Finding: Impact of Contextual Information

We evaluated three types of contextual information $$\mathbf{c}$$ for conditioning:

### 1. CWGAN-E2E-Pilots
**Conditioning**: Transmitted and received pilots $$\mathbf{c} = [\mathbf{X}_p, \mathbf{Y}_p]$$  
**Channel information**: Sparse pilot positions only  
**Result**: Some performance degradation

### 2. CWGAN-E2E-$$\hat{\mathbf{H}}$$
**Conditioning**: Channel estimates $$\mathbf{c} = \hat{\mathbf{H}}$$ (LS + LMMSE interpolation)  
**Channel information**: Explicit CSI across all subcarriers  
**Result**: Matches real channel performance - viable for practical deployment

### 3. CWGAN-E2E-$$\mathbf{Y}_{rg}$$
**Conditioning**: Full received resource grid $$\mathbf{c} = \mathbf{Y}_{rg}$$  
**Channel information**: Complete unprocessed observations  
**Result**: Matches real channel performance - viable for practical deployment

<div class="row justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/project/bler.png" title="BLER performance comparison" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Block error rate showing impact of contextual information.
</div>

---

## Performance Results

Evaluated under 3GPP CDL-C urban macro channel (100ns delay spread, 10 m/s mobility):

**Baseline systems:**
- 64-QAM with LS/LMMSE: Standard benchmark
- E2E with NN demapper only: Modular approach from prior work
- E2E with unified NN receiver: Real channel upper bound

**Key findings:**
- Neural receiver provides 2 dB gain over modular design
- All conditioning achieve satisfactory performance
- CWGAN sensitivity to contextual information quantifies information-performance trade-off
- Channel estimation/interpolation losses likely account for degradation

---

## Technical Implementation

**System specifications:**
- OFDM: 14 symbols × 128 subcarriers, 30 kHz spacing
- Modulation: 6 bits/symbol (64 constellation points)
- LDPC coding: Rate 0.5, 4176 info bits → 8352 coded bits
- Batch size: 128
- Training: 4000 iterations (CWGAN), 30000 iterations (E2E)

**Neural network architecture:**
- Generator: 3 Conv2D layers with skip connections
- Discriminator: 3 Conv2D layers + global pooling
- Neural receiver: 4 residual blocks with 128 filters
- Optimizer: Adam with adaptive learning rates

---

## Impact and Contributions

1. **Mathematical formalization** of E2E differentiability requirements in wireless communication
2. **Unified neural receiver** integrating channel estimation, equalization, and demapping
3. **Quantified information-performance trade-off** for practical CWGAN deployment
4. **Novel conditioning evaluation** showing channel estimates provide sufficient context

This work enables neural network optimization in wireless systems without requiring differentiable or known physical channels, advancing AI-native air interface design for 6G.

---

## Future Directions

- Hardware validation through over-the-air testing
- Extension to MIMO systems and multi-user scenarios
- Scalability analysis for systems with interference
- Integration with adaptive coding schemes
- Real-time deployment considerations