# Cloud Deployment Guide - Phase 12

This guide outlines deployment options for deploying Vedha AI to cloud virtual machines (VMs) and Kubernetes environments.

---

## 1. Deploying to Cloud Virtual Machines (AWS EC2 / GCP Compute Engine)

For single-instance VM deployments:
1. Provisions an Ubuntu VM instance.
2. Install Docker and Docker Compose.
3. Clone the repository and generate the production `.env` configuration.
4. Generate self-signed or Let's Encrypt certificates under `./deployment/ssl/`.
5. Launch the optimized stack:
   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```

---

## 2. Deploying to Kubernetes (EKS / GKE / AKS)

For scalable production clusters, convert the compose services into Kubernetes configurations:
- **Deployment & Pods Scaling:** Run the backend API pods using horizontal pod autoscalers (HPA) configured for CPU limits.
- **Persistent Storage (PVC):** Map PostgreSQL storage onto persistent cloud volumes (e.g. AWS EBS or GCP Persistent Disk).
- **Ingress Controller (NGINX):** Route HTTP/WebSocket traffic using an NGINX Ingress controller, terminating SSL/TLS certificates at the ingress level.
- **External Services:** For large enterprise production, replace the local containerized PostgreSQL and Redis with managed database services (e.g., AWS RDS PostgreSQL and AWS ElastiCache Redis) to maximize availability.
